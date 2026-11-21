export const speechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

export const recognitionSupported = typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

export type SpeechResult =
  | { ok: true; warning?: string }
  | { ok: false; reason: 'unsupported' | 'voice-missing' | 'playback-failed' | 'model-load-failed'; message?: string };

export type SpeechProgress =
  | { phase: 'loading-model'; percent: number | null }
  | { phase: 'preparing-engine' }
  | { phase: 'generating' }
  | { phase: 'playing' };

/* ---------- Built-in voices ---------- */

/** Languages with a built-in voice that runs on the device (Piper text-to-speech models). */
export type VoiceLanguage = 'fr' | 'es' | 'hi' | 'de';

type PiperVoiceConfig = {
  audio: { sample_rate: number };
  inference: { noise_scale: number; length_scale: number; noise_w: number };
  phoneme_id_map: Record<string, number[]>;
  vowel_clusters?: string[][];
};

/** Text → phoneme id sequences (one per sentence), plus any symbols the model has no id for. */
type Encode = (text: string) => { sentences: number[][]; dropped: string[] };

type VoiceRuntime = {
  session: Awaited<ReturnType<typeof import('onnxruntime-web').InferenceSession.create>>;
  config: PiperVoiceConfig;
  encode: Encode;
  cacheWarning: string | null;
};

type VoiceSpec = {
  /** Language name shown to learners. */
  name: string;
  modelUrl: string;
  configUrl: string;
  /** Exact model size, used to detect incomplete downloads. */
  sizeBytes: number;
  cacheName: string;
  /** Load the phonemizer for this voice and return its encoder. */
  createEncoder: (config: PiperVoiceConfig) => Promise<Encode>;
};

const PIPER_VOICES = 'https://huggingface.co/rhasspy/piper-voices/resolve/42301ec547bc2939386cf0ae9f9050ca05b1d3af';
const FRENCH_VOICE = 'https://huggingface.co/Trelis/piper-fr-fr-siwis-medium/resolve/83e01e593f3fd17077ef19b4867ace9075874915';

const VOICES: Record<VoiceLanguage, VoiceSpec> = {
  fr: {
    name: 'French',
    modelUrl: `${FRENCH_VOICE}/model.onnx`,
    configUrl: `${FRENCH_VOICE}/model.onnx.json`,
    sizeBytes: 63_201_294,
    cacheName: 'habla-french-voice-v1',
    createEncoder: async (config) => {
      const [{ FrenchG2P }, { Encoder }] = await Promise.all([import('@piper-plus/g2p/fr'), import('@piper-plus/g2p/encode')]);
      addFrenchNasalVowelAliases(config.phoneme_id_map);
      const phonemizer = new FrenchG2P();
      const encoder = new Encoder(config.phoneme_id_map);
      return (text) => {
        const { phonemeIds, droppedSymbols } = encoder.encode(phonemizer.phonemize(text).tokens);
        return { sentences: [phonemeIds], dropped: droppedSymbols };
      };
    },
  },
  es: {
    name: 'Spanish',
    modelUrl: `${PIPER_VOICES}/es/es_ES/davefx/medium/es_ES-davefx-medium.onnx`,
    configUrl: `${PIPER_VOICES}/es/es_ES/davefx/medium/es_ES-davefx-medium.onnx.json`,
    sizeBytes: 63_221_984,
    cacheName: 'habla-voice-es-v1',
    createEncoder: async (config) => {
      const { phonemizeSpanish } = await import('./g2p/spanish');
      return (text) => encodeSentences(phonemizeSpanish(text), config);
    },
  },
  de: {
    name: 'German',
    modelUrl: `${PIPER_VOICES}/de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx`,
    configUrl: `${PIPER_VOICES}/de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx.json`,
    sizeBytes: 63_221_984,
    cacheName: 'habla-voice-de-v1',
    createEncoder: async (config) => {
      const { phonemizeGerman } = await import('./g2p/german');
      return (text) => encodeSentences(phonemizeGerman(text), config);
    },
  },
  hi: {
    name: 'Hindi',
    modelUrl: `${PIPER_VOICES}/hi/hi_IN/rohan/medium/hi_IN-rohan-medium.onnx`,
    configUrl: `${PIPER_VOICES}/hi/hi_IN/rohan/medium/hi_IN-rohan-medium.onnx.json`,
    sizeBytes: 62_950_044,
    cacheName: 'habla-voice-hi-v1',
    createEncoder: async (config) => {
      const { phonemizeHindi } = await import('./g2p/hindi');
      return (text) => encodeSentences(phonemizeHindi(text), config);
    },
  },
};

/** Language name of a built-in voice, for messages. */
export function builtInVoiceName(language: VoiceLanguage): string {
  return VOICES[language].name;
}

/** Approximate download size of each built-in voice, in MB. */
export function builtInVoiceSizeMb(language: VoiceLanguage): number {
  return Math.round(VOICES[language].sizeBytes / 1_000_000);
}

/** The speech engine (WebAssembly runtime) shared by all built-in voices, in MB uncompressed. */
export const SPEECH_ENGINE_MB = 15;

/** The built-in voice for a BCP-47 tag such as `es-ES`, if there is one. */
export function builtInVoiceLanguage(lang: string): VoiceLanguage | null {
  const prefix = lang.toLowerCase().split(/[-_]/)[0];
  return prefix === 'fr' || prefix === 'es' || prefix === 'hi' || prefix === 'de' ? prefix : null;
}

const runtimes = new Map<VoiceLanguage, Promise<VoiceRuntime>>();
/** Everyone waiting for a voice to load hears its progress, not only the first caller. */
const loadListeners = new Map<VoiceLanguage, Set<(progress: SpeechProgress) => void>>();
let audioContext: AudioContext | null = null;
let activeSource: AudioBufferSourceNode | null = null;
/** Silence between sentences, in seconds. */
const SENTENCE_GAP = 0.18;

type CacheState = { cache: Cache | null; warning: string | null };
const frenchNasalVowelAliases: Record<string, string> = {
  'ɛ̃': '',
  'ɑ̃': '',
  'ɔ̃': '',
  'œ̃': '',
};

function hasAudioContext(): boolean {
  return typeof window !== 'undefined' && 'AudioContext' in window;
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isPiperVoiceConfig(value: unknown): value is PiperVoiceConfig {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  const audio = record.audio;
  const inference = record.inference;
  const phonemeIdMap = record.phoneme_id_map;
  return Boolean(
    audio &&
      typeof audio === 'object' &&
      'sample_rate' in audio &&
      typeof audio.sample_rate === 'number' &&
      inference &&
      typeof inference === 'object' &&
      'noise_scale' in inference &&
      typeof inference.noise_scale === 'number' &&
      'length_scale' in inference &&
      typeof inference.length_scale === 'number' &&
      'noise_w' in inference &&
      typeof inference.noise_w === 'number' &&
      phonemeIdMap &&
      typeof phonemeIdMap === 'object' &&
      Object.values(phonemeIdMap).every(
        (ids) => Array.isArray(ids) && ids.every((id) => Number.isInteger(id)),
      ),
  );
}

/** Add legacy Piper aliases for the French model's nasal-vowel phonemes. */
export function addFrenchNasalVowelAliases(
  phonemeIdMap: Record<string, number[]>,
): void {
  const padId = phonemeIdMap._?.[0];
  if (padId === undefined) throw new Error('French voice model is missing its padding phoneme.');

  for (const phoneme of ['ɛ̃', 'ɑ̃', 'ɔ̃', 'œ̃']) {
    const pua = frenchNasalVowelAliases[phoneme];
    if (!pua || phonemeIdMap[pua]) continue;

    const ids = [...phoneme].map((character) => phonemeIdMap[character]);
    if (ids.some((characterIds) => !characterIds?.length)) continue;

    phonemeIdMap[pua] = ids.flatMap((characterIds, index) =>
      index === 0 ? characterIds : [padId, ...characterIds],
    );
  }
}

/**
 * eSpeak-style phonemes → Piper ids, exactly as Piper prepares them for its eSpeak voices: the string is split into
 * Unicode codepoints (NFD, so ĩ is i + combining tilde), vowel clusters the model learned as one symbol (such as aɪ)
 * are merged, and each id is followed by the padding id between `^` and `$`.
 */
export function encodeEspeakPhonemes(
  phonemes: string,
  config: Pick<PiperVoiceConfig, 'phoneme_id_map' | 'vowel_clusters'>,
): { ids: number[]; dropped: string[] } {
  const map = config.phoneme_id_map;
  const symbols = [...phonemes.normalize('NFD')];
  const clusters = (config.vowel_clusters ?? []).map((cluster) => cluster.join('')).filter((cluster) => map[cluster]);
  const merged: string[] = [];
  for (let i = 0; i < symbols.length; i++) {
    const pair = symbols[i] + (symbols[i + 1] ?? '');
    if (symbols[i + 1] && clusters.includes(pair)) {
      merged.push(pair);
      i++;
    } else merged.push(symbols[i]);
  }

  const pad = map._ ?? [];
  const ids = [...(map['^'] ?? []), ...pad];
  const dropped = new Set<string>();
  for (const symbol of merged) {
    const symbolIds = map[symbol];
    if (!symbolIds) {
      dropped.add(symbol);
      continue;
    }
    ids.push(...symbolIds, ...pad);
  }
  ids.push(...(map.$ ?? []));
  return { ids, dropped: [...dropped] };
}

function encodeSentences(sentences: string[], config: PiperVoiceConfig): { sentences: number[][]; dropped: string[] } {
  const dropped = new Set<string>();
  const encoded = sentences.map((sentence) => {
    const result = encodeEspeakPhonemes(sentence, config);
    result.dropped.forEach((symbol) => dropped.add(symbol));
    return result.ids;
  });
  // A sentence of only BOS, PAD and EOS has nothing to say.
  return { sentences: encoded.filter((ids) => ids.length > 3), dropped: [...dropped] };
}

function cacheUnavailableMessage(spec: VoiceSpec): string {
  return `Browser storage is unavailable or full. ${spec.name} speech works for this session, but the voice may need to download again next time.`;
}

async function openModelCache(spec: VoiceSpec): Promise<CacheState> {
  if (!('caches' in window)) return { cache: null, warning: cacheUnavailableMessage(spec) };
  try {
    return { cache: await window.caches.open(spec.cacheName), warning: null };
  } catch (error) {
    console.warn(`Could not open browser storage for the ${spec.name} voice.`, error);
    return { cache: null, warning: cacheUnavailableMessage(spec) };
  }
}

async function cacheResponse(spec: VoiceSpec, cacheState: CacheState, url: string, response: Response): Promise<void> {
  if (!cacheState.cache) return;
  try {
    await cacheState.cache.put(url, response);
  } catch (error) {
    console.warn(`Could not store the ${spec.name} voice in browser storage.`, error);
    cacheState.warning = cacheUnavailableMessage(spec);
  }
}

async function fetchConfig(spec: VoiceSpec, cacheState: CacheState): Promise<PiperVoiceConfig> {
  let response: Response | undefined;
  try {
    response = await cacheState.cache?.match(spec.configUrl);
  } catch (error) {
    console.warn(`Could not read the ${spec.name} voice settings from browser storage.`, error);
    cacheState.warning = cacheUnavailableMessage(spec);
  }
  if (!response) {
    response = await fetch(spec.configUrl);
    if (!response.ok) throw new Error(`${spec.name} voice settings download failed (${response.status}).`);
    await cacheResponse(spec, cacheState, spec.configUrl, response.clone());
  }

  const value: unknown = await response.json();
  if (!isPiperVoiceConfig(value)) throw new Error(`${spec.name} voice settings have an unsupported format.`);
  return value;
}

async function readModelWithProgress(
  spec: VoiceSpec,
  response: Response,
  onProgress: (progress: SpeechProgress) => void,
): Promise<ArrayBuffer> {
  const total = Number(response.headers.get('content-length')) || spec.sizeBytes;
  if (!response.body) {
    const buffer = await response.arrayBuffer();
    onProgress({ phase: 'loading-model', percent: 100 });
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  let lastPercent = -1;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    const percent = Math.min(100, Math.round((loaded / total) * 100));
    if (percent !== lastPercent) {
      lastPercent = percent;
      onProgress({ phase: 'loading-model', percent });
    }
  }

  const bytes = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  if (bytes.byteLength === 0) throw new Error(`${spec.name} voice download was empty.`);
  return bytes.buffer;
}

async function fetchModel(
  spec: VoiceSpec,
  cacheState: CacheState,
  onProgress: (progress: SpeechProgress) => void,
): Promise<ArrayBuffer> {
  let cached: Response | undefined;
  try {
    cached = await cacheState.cache?.match(spec.modelUrl);
  } catch (error) {
    console.warn(`Could not read the ${spec.name} voice from browser storage.`, error);
    cacheState.warning = cacheUnavailableMessage(spec);
  }
  if (cached) {
    const cachedBytes = await cached.arrayBuffer();
    if (cachedBytes.byteLength === spec.sizeBytes) {
      onProgress({ phase: 'loading-model', percent: 100 });
      return cachedBytes;
    }

    console.warn(`The stored ${spec.name} voice is incomplete; downloading a fresh copy.`);
    try {
      await cacheState.cache?.delete(spec.modelUrl);
    } catch (error) {
      console.warn(`Could not remove the incomplete ${spec.name} voice from browser storage.`, error);
    }
  }

  const response = await fetch(spec.modelUrl);
  if (!response.ok) throw new Error(`${spec.name} voice download failed (${response.status}).`);

  const cacheWrite = cacheResponse(spec, cacheState, spec.modelUrl, response.clone());
  const bytes = await readModelWithProgress(spec, response, onProgress);
  if (bytes.byteLength !== spec.sizeBytes) {
    throw new Error(`${spec.name} voice download was incomplete (${bytes.byteLength} bytes).`);
  }
  await cacheWrite;
  return bytes;
}

async function loadRuntime(language: VoiceLanguage, onProgress: (progress: SpeechProgress) => void): Promise<VoiceRuntime> {
  const spec = VOICES[language];
  onProgress({ phase: 'loading-model', percent: 0 });
  const cacheState = await openModelCache(spec);
  const config = await fetchConfig(spec, cacheState);
  const model = await fetchModel(spec, cacheState, onProgress);
  onProgress({ phase: 'preparing-engine' });

  const [ort, wasmUrl, encode] = await Promise.all([
    import('onnxruntime-web/wasm'),
    import('onnxruntime-web/ort-wasm-simd-threaded.wasm?url'),
    spec.createEncoder(config),
  ]);
  ort.env.wasm.wasmPaths = { wasm: wasmUrl.default };
  ort.env.wasm.numThreads = 1;
  const session = await ort.InferenceSession.create(model, { executionProviders: ['wasm'] });
  const requiredInputs = ['input', 'input_lengths', 'scales'];
  if (requiredInputs.some((input) => !session.inputNames.includes(input)) || !session.outputNames[0]) {
    await session.release();
    throw new Error(`The downloaded ${spec.name} voice has an unsupported format.`);
  }

  return { session, config, encode, cacheWarning: cacheState.warning };
}

/** Load a voice once and share it; other languages' voices are released to keep memory low on phones. */
function getRuntime(language: VoiceLanguage, onProgress: (progress: SpeechProgress) => void): Promise<VoiceRuntime> {
  let runtime = runtimes.get(language);
  const listeners = loadListeners.get(language) ?? new Set();
  loadListeners.set(language, listeners);
  listeners.add(onProgress);
  if (!runtime) {
    const broadcast = (progress: SpeechProgress) => loadListeners.get(language)?.forEach((listener) => listener(progress));
    runtime = loadRuntime(language, broadcast)
      .catch((error: unknown) => {
        runtimes.delete(language);
        throw error;
      })
      .finally(() => loadListeners.delete(language));
    runtimes.set(language, runtime);
    void runtime.then(() => {
      for (const [other, pending] of runtimes) {
        if (other === language) continue;
        runtimes.delete(other);
        void pending.then((loaded) => loaded.session.release()).catch(() => undefined);
      }
    }, () => undefined);
  }
  return runtime.finally(() => loadListeners.get(language)?.delete(onProgress));
}

function getAudioContext(): AudioContext {
  audioContext ??= new window.AudioContext();
  return audioContext;
}

/** Stop any built-in voice or device voice that is playing. */
export function stopSpeech(): void {
  if (activeSource) {
    const source = activeSource;
    activeSource = null;
    try {
      source.stop();
    } catch {
      // Already stopped.
    }
  }
  if (speechSupported) window.speechSynthesis.cancel();
}

async function speakBuiltIn(
  language: VoiceLanguage,
  text: string,
  opts: { slow?: boolean; rate?: 0.5 | 1; onProgress?: (progress: SpeechProgress) => void },
): Promise<SpeechResult> {
  if (!hasAudioContext()) return { ok: false, reason: 'unsupported' };
  const spec = VOICES[language];
  const onProgress = opts.onProgress ?? (() => {});

  let context: AudioContext;
  try {
    context = getAudioContext();
    // Resume inside the tap so mobile browsers allow audio once the voice is ready.
    await context.resume();
  } catch (error) {
    return { ok: false, reason: 'playback-failed', message: errorText(error) };
  }

  let runtime: VoiceRuntime;
  try {
    runtime = await getRuntime(language, onProgress);
  } catch (error) {
    return { ok: false, reason: 'model-load-failed', message: errorText(error) };
  }

  try {
    onProgress({ phase: 'generating' });
    const { sentences, dropped } = runtime.encode(text);
    if (dropped.length > 0) console.warn(`${spec.name} voice skipped unsupported symbol(s): ${dropped.join(' ')}`);
    if (!sentences.length) throw new Error(`There is no ${spec.name} text to read.`);

    const { Tensor } = await import('onnxruntime-web/wasm');
    const { inference } = runtime.config;
    const lengthScale = opts.rate !== undefined ? inference.length_scale / opts.rate : opts.slow ? inference.length_scale * 1.2 : inference.length_scale;
    const scales = new Tensor('float32', Float32Array.of(inference.noise_scale, lengthScale, inference.noise_w), [3]);
    const sampleRate = runtime.config.audio.sample_rate;
    const gap = Math.round(SENTENCE_GAP * sampleRate);
    const parts: Float32Array[] = [];
    for (const ids of sentences) {
      const output = await runtime.session.run({
        input: new Tensor('int64', BigInt64Array.from(ids, BigInt), [1, ids.length]),
        input_lengths: new Tensor('int64', BigInt64Array.of(BigInt(ids.length)), [1]),
        scales,
      });
      const audio = output[runtime.session.outputNames[0]];
      if (!audio || !(audio.data instanceof Float32Array) || audio.data.length === 0) {
        throw new Error(`${spec.name} voice produced no audio.`);
      }
      parts.push(audio.data);
    }
    const length = parts.reduce((sum, part) => sum + part.length, 0) + gap * (parts.length - 1);
    const samples = new Float32Array(length);
    let offset = 0;
    for (const part of parts) {
      samples.set(part, offset);
      offset += part.length + gap;
    }

    await context.resume();
    const buffer = context.createBuffer(1, samples.length, sampleRate);
    buffer.copyToChannel(samples, 0);
    stopSpeech();
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    activeSource = source;
    onProgress({ phase: 'playing' });
    await new Promise<void>((resolve, reject) => {
      source.onended = () => {
        if (activeSource === source) activeSource = null;
        resolve();
      };
      try {
        source.start();
      } catch (error) {
        if (activeSource === source) activeSource = null;
        reject(error);
      }
    });
    return { ok: true, warning: runtime.cacheWarning ?? undefined };
  } catch (error) {
    if (activeSource) {
      activeSource.onended = null;
      activeSource = null;
    }
    return { ok: false, reason: 'playback-failed', message: errorText(error) };
  }
}

/* ---------- Device voices (Web Speech) ---------- */

function voices(): SpeechSynthesisVoice[] {
  return speechSupported ? window.speechSynthesis.getVoices() : [];
}

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const requested = lang.toLowerCase().replace(/_/g, '-');
  const prefix = requested.split('-')[0];
  const available = voices();
  return available.find((voice) => voice.lang.toLowerCase().replace(/_/g, '-') === requested)
    ?? available.find((voice) => voice.lang.toLowerCase().replace(/_/g, '-').split('-')[0] === prefix)
    ?? null;
}

function waitForVoice(lang: string): Promise<SpeechSynthesisVoice | null> {
  const current = pickVoice(lang);
  if (current) return Promise.resolve(current);

  const synth = window.speechSynthesis;
  return new Promise((resolve) => {
    let settled = false;
    const finish = (voice: SpeechSynthesisVoice | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      synth.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(voice);
    };
    const onVoicesChanged = () => {
      const voice = pickVoice(lang);
      if (voice) finish(voice);
    };
    const timeout = window.setTimeout(() => finish(pickVoice(lang)), 3000);
    synth.addEventListener('voiceschanged', onVoicesChanged);
    onVoicesChanged();
  });
}

// Trigger voice discovery early; some browsers populate voices asynchronously.
if (speechSupported) voices();

async function speakWithDevice(text: string, lang: string, opts: { slow?: boolean; rate?: 0.5 | 1 }): Promise<SpeechResult> {
  if (!speechSupported) return { ok: false, reason: 'unsupported' };

  const voice = await waitForVoice(lang);
  if (!voice) return { ok: false, reason: 'voice-missing' };

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice.lang || lang;
  utterance.voice = voice;
  utterance.rate = opts.rate ?? (opts.slow ? 0.6 : 0.95);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: SpeechResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      utterance.onend = null;
      utterance.onerror = null;
      resolve(result);
    };
    // Long sentences at half speed can take a while; allow roughly 0.3 s per character.
    const timeout = window.setTimeout(() => finish({ ok: false, reason: 'playback-failed' }), Math.max(15_000, text.length * 300));
    utterance.onend = () => finish({ ok: true });
    // A newer playback interrupting this one is not a failure.
    utterance.onerror = (event) =>
      finish(event.error === 'interrupted' || event.error === 'canceled' ? { ok: true } : { ok: false, reason: 'playback-failed' });

    stopSpeech();
    try {
      synth.speak(utterance);
    } catch {
      finish({ ok: false, reason: 'playback-failed' });
    }
  });
}

/** Whether this language can be spoken: a built-in voice or a voice installed on the device. */
export function hasVoice(lang: string): boolean {
  return (builtInVoiceLanguage(lang) !== null && hasAudioContext()) || pickVoice(lang) !== null;
}

/**
 * Read text aloud and report missing voices or playback failures to the caller. French, Spanish and Hindi use the
 * built-in voice (downloaded on first use); if it can't load, the device's own voice is used when there is one.
 */
export async function speak(
  text: string,
  lang: string,
  opts: { slow?: boolean; rate?: 0.5 | 1; onProgress?: (progress: SpeechProgress) => void } = {},
): Promise<SpeechResult> {
  const language = builtInVoiceLanguage(lang);
  if (language && hasAudioContext()) {
    const result = await speakBuiltIn(language, text, opts);
    if (result.ok || result.reason !== 'model-load-failed' || !pickVoice(lang)) return result;
    const fallback = await speakWithDevice(text, lang, opts);
    return fallback.ok
      ? { ok: true, warning: `The built-in ${VOICES[language].name} voice couldn't load, so your device's voice was used. (${result.message ?? 'Check your connection.'})` }
      : result;
  }
  return speakWithDevice(text, lang, opts);
}

/* ---------- Offline audio ---------- */

export type BuiltInVoiceStatus = 'downloaded' | 'missing' | 'unavailable';

/** Whether a built-in voice is stored in this browser (without loading the model). */
export async function builtInVoiceStatus(language: VoiceLanguage): Promise<BuiltInVoiceStatus> {
  if (typeof window === 'undefined' || !('caches' in window) || !hasAudioContext()) return 'unavailable';
  const spec = VOICES[language];
  try {
    const cache = await window.caches.open(spec.cacheName);
    const [model, config] = await Promise.all([cache.match(spec.modelUrl), cache.match(spec.configUrl)]);
    if (!model || !config) return 'missing';
    const size = Number(model.headers.get('content-length'));
    return !size || size === spec.sizeBytes ? 'downloaded' : 'missing';
  } catch {
    return 'unavailable';
  }
}

/**
 * Download and prepare a built-in voice so it works offline: the model and settings go to browser storage, and
 * loading the speech engine lets the service worker keep its code for offline use.
 */
export async function downloadBuiltInVoice(
  language: VoiceLanguage,
  onProgress: (progress: SpeechProgress) => void,
): Promise<{ ok: true; warning?: string } | { ok: false; message: string }> {
  if (!hasAudioContext()) return { ok: false, message: `This browser cannot play the built-in ${VOICES[language].name} voice.` };
  try {
    const runtime = await getRuntime(language, onProgress);
    return { ok: true, warning: runtime.cacheWarning ?? undefined };
  } catch (error) {
    return { ok: false, message: errorText(error) };
  }
}

/** Remove a stored built-in voice to free space. It downloads again on next use. */
export async function removeBuiltInVoice(language: VoiceLanguage): Promise<void> {
  const pending = runtimes.get(language);
  runtimes.delete(language);
  const runtime = pending ? await pending.catch(() => null) : null;
  await runtime?.session.release().catch(() => undefined);
  if ('caches' in window) await window.caches.delete(VOICES[language].cacheName);
}

export type DeviceVoiceStatus =
  | { kind: 'offline'; name: string }
  | { kind: 'online'; name: string }
  | { kind: 'missing' }
  | { kind: 'unsupported' };

/**
 * Describe the device voice used for a language. `localService` voices are installed on the device and
 * work without a connection; network voices need the internet.
 */
export function deviceVoiceStatus(lang: string): DeviceVoiceStatus {
  if (!speechSupported) return { kind: 'unsupported' };
  const requested = lang.toLowerCase().replace(/_/g, '-');
  const prefix = requested.split('-')[0];
  const matching = voices().filter((voice) => voice.lang.toLowerCase().replace(/_/g, '-').split('-')[0] === prefix);
  if (!matching.length) return { kind: 'missing' };
  const local = matching.find((voice) => voice.localService);
  return local ? { kind: 'offline', name: local.name } : { kind: 'online', name: matching[0].name };
}

/** Call back when the browser's voice list changes (voices often load after the page). */
export function onVoicesChanged(callback: () => void): () => void {
  if (!speechSupported) return () => undefined;
  window.speechSynthesis.addEventListener('voiceschanged', callback);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', callback);
}

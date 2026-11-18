export const speechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

export type SpeechResult =
  | { ok: true; warning?: string }
  | { ok: false; reason: 'unsupported' | 'voice-missing' | 'playback-failed' | 'model-load-failed'; message?: string };

export type SpeechProgress =
  | { phase: 'loading-model'; percent: number | null }
  | { phase: 'preparing-engine' }
  | { phase: 'generating' }
  | { phase: 'playing' };

type PiperVoiceConfig = {
  audio: { sample_rate: number };
  inference: { noise_scale: number; length_scale: number; noise_w: number };
  phoneme_id_map: Record<string, number[]>;
};

type FrenchRuntime = {
  session: Awaited<ReturnType<typeof import('onnxruntime-web').InferenceSession.create>>;
  config: PiperVoiceConfig;
  phonemizer: InstanceType<typeof import('@piper-plus/g2p/fr').FrenchG2P>;
  encoder: InstanceType<typeof import('@piper-plus/g2p/encode').Encoder>;
  cacheWarning: string | null;
};

const frenchVoiceFiles =
  'https://huggingface.co/Trelis/piper-fr-fr-siwis-medium/resolve/83e01e593f3fd17077ef19b4867ace9075874915';
const frenchModelUrl = `${frenchVoiceFiles}/model.onnx`;
const frenchConfigUrl = `${frenchVoiceFiles}/model.onnx.json`;
const frenchModelCache = 'habla-french-voice-v1';
const frenchVoiceModelSizeBytes = 63_201_294;
export const frenchModelSizeMb = Math.round(frenchVoiceModelSizeBytes / 1_000_000);
let frenchRuntimePromise: Promise<FrenchRuntime> | null = null;
let audioContext: AudioContext | null = null;
let activeFrenchSource: AudioBufferSourceNode | null = null;

type FrenchCacheState = { cache: Cache | null; warning: string | null };
type ModelAssetCache = { bytes: ArrayBuffer; warning: string | null };
const frenchNasalVowelAliases: Record<string, string> = {
  'ɛ̃': '\uE056',
  'ɑ̃': '\uE057',
  'ɔ̃': '\uE058',
  'œ̃': '\uE063',
};

function isFrench(lang: string): boolean {
  return lang.toLowerCase().startsWith('fr');
}

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

function cacheUnavailableMessage(): string {
  return 'Browser storage is unavailable or full. French speech works for this session, but the model may need to download again next time.';
}

async function openFrenchModelCache(): Promise<FrenchCacheState> {
  if (!('caches' in window)) return { cache: null, warning: cacheUnavailableMessage() };
  try {
    return { cache: await window.caches.open(frenchModelCache), warning: null };
  } catch (error) {
    console.warn('Could not open browser storage for the French voice model.', error);
    return { cache: null, warning: cacheUnavailableMessage() };
  }
}

async function cacheResponse(
  cacheState: FrenchCacheState,
  url: string,
  response: Response,
): Promise<void> {
  if (!cacheState.cache) return;
  try {
    await cacheState.cache.put(url, response);
  } catch (error) {
    console.warn('Could not cache a French voice asset in browser storage.', error);
    cacheState.warning = cacheUnavailableMessage();
  }
}

async function fetchFrenchConfig(cacheState: FrenchCacheState): Promise<PiperVoiceConfig> {
  let response: Response | undefined;
  try {
    response = await cacheState.cache?.match(frenchConfigUrl);
  } catch (error) {
    console.warn('Could not read the French voice configuration from browser storage.', error);
    cacheState.warning = cacheUnavailableMessage();
  }
  if (!response) {
    response = await fetch(frenchConfigUrl);
    if (!response.ok) {
      throw new Error(`French voice configuration download failed (${response.status}).`);
    }
    await cacheResponse(cacheState, frenchConfigUrl, response.clone());
  }

  const value: unknown = await response.json();
  if (!isPiperVoiceConfig(value)) throw new Error('French voice configuration has an unsupported format.');
  return value;
}

async function readModelWithProgress(
  response: Response,
  onProgress: (progress: SpeechProgress) => void,
): Promise<ArrayBuffer> {
  const total = Number(response.headers.get('content-length')) || null;
  if (!response.body) {
    const buffer = await response.arrayBuffer();
    onProgress({ phase: 'loading-model', percent: 100 });
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    onProgress({
      phase: 'loading-model',
      percent: total ? Math.min(100, Math.round((loaded / total) * 100)) : null,
    });
  }

  const bytes = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  if (bytes.byteLength === 0) throw new Error('French voice model download was empty.');
  return bytes.buffer;
}

async function fetchFrenchModel(
  cacheState: FrenchCacheState,
  onProgress: (progress: SpeechProgress) => void,
): Promise<ModelAssetCache> {
  let cached: Response | undefined;
  try {
    cached = await cacheState.cache?.match(frenchModelUrl);
  } catch (error) {
    console.warn('Could not read the French voice model from browser storage.', error);
    cacheState.warning = cacheUnavailableMessage();
  }
  if (cached) {
    const cachedBytes = await cached.arrayBuffer();
    if (cachedBytes.byteLength === frenchVoiceModelSizeBytes) {
      onProgress({ phase: 'loading-model', percent: 100 });
      return { bytes: cachedBytes, warning: null };
    }

    console.warn('Cached French voice model is incomplete; downloading a fresh copy.');
    try {
      await cacheState.cache?.delete(frenchModelUrl);
    } catch (error) {
      console.warn('Could not remove the incomplete French voice model from browser storage.', error);
    }
  }

  const response = await fetch(frenchModelUrl);
  if (!response.ok) throw new Error(`French voice model download failed (${response.status}).`);

  const cacheWrite = cacheResponse(cacheState, frenchModelUrl, response.clone());
  const bytes = await readModelWithProgress(response, onProgress);
  if (bytes.byteLength !== frenchVoiceModelSizeBytes) {
    throw new Error(`French voice model download was incomplete (${bytes.byteLength} bytes).`);
  }
  await cacheWrite;
  return { bytes, warning: cacheState.warning };
}

async function loadFrenchRuntime(onProgress: (progress: SpeechProgress) => void): Promise<FrenchRuntime> {
  onProgress({ phase: 'loading-model', percent: 0 });
  const cacheState = await openFrenchModelCache();
  const config = await fetchFrenchConfig(cacheState);
  const model = await fetchFrenchModel(cacheState, onProgress);
  onProgress({ phase: 'preparing-engine' });

  const [{ FrenchG2P }, { Encoder }, ort, wasmUrl] = await Promise.all([
    import('@piper-plus/g2p/fr'),
    import('@piper-plus/g2p/encode'),
    import('onnxruntime-web/wasm'),
    import('onnxruntime-web/ort-wasm-simd-threaded.wasm?url'),
  ]);
  ort.env.wasm.wasmPaths = { wasm: wasmUrl.default };
  ort.env.wasm.numThreads = 1;
  addFrenchNasalVowelAliases(config.phoneme_id_map);
  const phonemizer = new FrenchG2P();
  const encoder = new Encoder(config.phoneme_id_map);
  const session = await ort.InferenceSession.create(model.bytes, { executionProviders: ['wasm'] });
  const requiredInputs = ['input', 'input_lengths', 'scales'];
  if (requiredInputs.some((input) => !session.inputNames.includes(input)) || !session.outputNames[0]) {
    await session.release();
    throw new Error('The downloaded French voice model has an unsupported ONNX format.');
  }

  return {
    session,
    config,
    phonemizer,
    encoder,
    cacheWarning: model.warning ?? cacheState.warning,
  };
}

function getFrenchRuntime(onProgress: (progress: SpeechProgress) => void): Promise<FrenchRuntime> {
  if (!frenchRuntimePromise) {
    frenchRuntimePromise = loadFrenchRuntime(onProgress).catch((error: unknown) => {
      frenchRuntimePromise = null;
      throw error;
    });
  }
  return frenchRuntimePromise;
}

function getAudioContext(): AudioContext {
  audioContext ??= new window.AudioContext();
  return audioContext;
}

async function speakFrench(
  text: string,
  opts: { slow?: boolean; onProgress?: (progress: SpeechProgress) => void },
): Promise<SpeechResult> {
  if (!hasAudioContext()) return { ok: false, reason: 'unsupported' };
  const onProgress = opts.onProgress ?? (() => {});

  let context: AudioContext;
  try {
    context = getAudioContext();
    onProgress({ phase: 'loading-model', percent: 0 });
    await context.resume();
  } catch (error) {
    return { ok: false, reason: 'playback-failed', message: errorText(error) };
  }

  let runtime: FrenchRuntime;
  try {
    runtime = await getFrenchRuntime(onProgress);
  } catch (error) {
    return { ok: false, reason: 'model-load-failed', message: errorText(error) };
  }

  try {
    onProgress({ phase: 'generating' });
    const { tokens } = runtime.phonemizer.phonemize(text);
    const encoded = runtime.encoder.encode(tokens);
    if (encoded.droppedSymbols.length > 0) {
      throw new Error(`Unsupported French phoneme(s): ${encoded.droppedSymbols.join(', ')}`);
    }

    const { Tensor } = await import('onnxruntime-web/wasm');
    const output = await runtime.session.run({
      input: new Tensor('int64', BigInt64Array.from(encoded.phonemeIds, BigInt), [1, encoded.phonemeIds.length]),
      input_lengths: new Tensor('int64', BigInt64Array.of(BigInt(encoded.phonemeIds.length)), [1]),
      scales: new Tensor(
        'float32',
        Float32Array.of(
          runtime.config.inference.noise_scale,
          opts.slow ? runtime.config.inference.length_scale * 1.2 : runtime.config.inference.length_scale,
          runtime.config.inference.noise_w,
        ),
        [3],
      ),
    });
    const audio = output[runtime.session.outputNames[0]];
    if (!audio || !(audio.data instanceof Float32Array) || audio.data.length === 0) {
      throw new Error('French voice produced no audio samples.');
    }

    await context.resume();
    const buffer = context.createBuffer(1, audio.data.length, runtime.config.audio.sample_rate);
    buffer.copyToChannel(new Float32Array(audio.data), 0);
    activeFrenchSource?.stop();
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    activeFrenchSource = source;
    onProgress({ phase: 'playing' });
    await new Promise<void>((resolve, reject) => {
      source.onended = () => {
        if (activeFrenchSource === source) activeFrenchSource = null;
        resolve();
      };
      try {
        source.start();
      } catch (error) {
        if (activeFrenchSource === source) activeFrenchSource = null;
        reject(error);
      }
    });
    return { ok: true, warning: runtime.cacheWarning ?? undefined };
  } catch (error) {
    if (activeFrenchSource) {
      activeFrenchSource.onended = null;
      activeFrenchSource = null;
    }
    return { ok: false, reason: 'playback-failed', message: errorText(error) };
  }
}

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

/** Whether the browser currently has a voice for this language. */
export function hasVoice(lang: string): boolean {
  return (isFrench(lang) && hasAudioContext()) || pickVoice(lang) !== null;
}

/** Read text aloud and report missing voices or playback failures to the caller. */
export async function speak(
  text: string,
  lang: string,
  opts: { slow?: boolean; onProgress?: (progress: SpeechProgress) => void } = {},
): Promise<SpeechResult> {
  if (isFrench(lang) && hasAudioContext()) return speakFrench(text, opts);
  if (!speechSupported) return { ok: false, reason: 'unsupported' };

  const voice = await waitForVoice(lang);
  if (!voice) return { ok: false, reason: 'voice-missing' };

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice.lang || lang;
  utterance.voice = voice;
  utterance.rate = opts.slow ? 0.6 : 0.95;

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
    const timeout = window.setTimeout(() => finish({ ok: false, reason: 'playback-failed' }), 15_000);
    utterance.onend = () => finish({ ok: true });
    utterance.onerror = () => finish({ ok: false, reason: 'playback-failed' });

    synth.cancel();
    try {
      synth.speak(utterance);
    } catch {
      finish({ ok: false, reason: 'playback-failed' });
    }
  });
}

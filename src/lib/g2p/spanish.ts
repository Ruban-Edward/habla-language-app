/**
 * Castilian Spanish text → eSpeak-style IPA, for Piper voices trained on eSpeak NG phonemes (`espeak.voice: "es"`).
 *
 * Spanish spelling is regular enough that a rule set reproduces what those voices were trained on: stress from
 * accent marks and the penultimate/final rule, glides in diphthongs (`bueno` → bwˈeno), soft b/d/g between
 * vowels (`agua` → ˈaɣwa), θ for c/z, tap vs. trill r, and nasal assimilation (`un beso` → ˈum bˈeso).
 * The output marks stress before the stressed vowel, as eSpeak does.
 */

type Unit =
  | { kind: 'C'; ph: string }
  | { kind: 'V'; ph: string; accent: boolean; weak: boolean; letter: string }
  /** Placeholders resolved from the phrase context: b/β, d/ð, ɡ/ɣ, n/m/ŋ. */
  | { kind: 'X'; ph: 'B' | 'D' | 'G' | 'N' };

type Segment = { ph: string; kind: 'C' | 'V' | 'G' | 'X' | 'M' };

const STRONG = new Set(['a', 'e', 'o', 'á', 'é', 'ó']);
const WEAK = new Set(['i', 'u', 'í', 'ú', 'ü']);
const ACCENTED = new Set(['á', 'é', 'í', 'ó', 'ú']);
const PLAIN: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u' };
const FRONT = new Set(['e', 'i', 'é', 'í']);
const NASALS = new Set(['m', 'n', 'ɲ', 'ŋ']);

/** Monosyllables that eSpeak leaves unstressed inside a phrase. */
const UNSTRESSED = new Set([
  'el', 'la', 'los', 'las', 'lo', 'le', 'les', 'me', 'te', 'se', 'nos', 'os', 'mi', 'mis', 'tu', 'tus', 'su', 'sus',
  'de', 'del', 'a', 'al', 'en', 'con', 'por', 'sin', 'y', 'e', 'o', 'u', 'ni', 'que', 'si',
]);
/** Function words that take secondary rather than primary stress inside a phrase. */
const SECONDARY = new Set(['para', 'pero', 'como', 'cuando', 'donde', 'porque', 'hasta']);
/** Whole-word pronunciations the rules get wrong. */
const EXCEPTIONS: Record<string, string> = {
  méxico: 'mˈɛxiko',
  mexicano: 'mexikˈano',
  mexicana: 'mexikˈana',
  texas: 'tˈexas',
  oaxaca: 'oaxˈaka',
};

const UNITS = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce',
  'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno',
  'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos',
  'setecientos', 'ochocientos', 'novecientos'];

/** Spell out a whole number in Spanish (0–999 999); longer numbers are read digit by digit. */
export function spanishNumber(value: number): string {
  if (value === 0) return 'cero';
  if (value >= 1_000_000) return String(value).split('').map((d) => spanishNumber(Number(d))).join(' ');
  const below100 = (n: number) => (n < 30 ? UNITS[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ` y ${UNITS[n % 10]}` : ''));
  const below1000 = (n: number) => {
    if (n === 100) return 'cien';
    const h = Math.floor(n / 100);
    return [HUNDREDS[h], below100(n % 100)].filter(Boolean).join(' ');
  };
  const thousands = Math.floor(value / 1000);
  const rest = value % 1000;
  const head = thousands === 0 ? '' : thousands === 1 ? 'mil' : `${below1000(thousands)} mil`;
  return [head, rest ? below1000(rest) : ''].filter(Boolean).join(' ');
}

/** Letters of one lowercase word → phoneme units, with b/d/g/n left for the phrase pass. */
function wordUnits(word: string): Unit[] {
  const units: Unit[] = [];
  const at = (i: number) => word[i] ?? '';
  const isVowel = (ch: string) => STRONG.has(ch) || WEAK.has(ch);
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const next = at(i + 1);
    if (STRONG.has(ch) || WEAK.has(ch)) {
      units.push({ kind: 'V', ph: PLAIN[ch] ?? ch, accent: ACCENTED.has(ch), weak: WEAK.has(ch), letter: ch });
      continue;
    }
    switch (ch) {
      case 'y':
        if (isVowel(next)) units.push({ kind: 'C', ph: 'ʝ' });
        else units.push({ kind: 'V', ph: 'i', accent: false, weak: true, letter: 'y' });
        break;
      case 'h':
        break;
      case 'c':
        if (next === 'h') {
          units.push({ kind: 'C', ph: 'tʃ' });
          i++;
        } else units.push({ kind: 'C', ph: FRONT.has(next) ? 'θ' : 'k' });
        break;
      case 'q':
        units.push({ kind: 'C', ph: 'k' });
        if (next === 'u') i++;
        break;
      case 'g':
        if (FRONT.has(next)) units.push({ kind: 'C', ph: 'x' });
        else {
          units.push({ kind: 'X', ph: 'G' });
          if (next === 'u' && FRONT.has(at(i + 2))) i++;
        }
        break;
      case 'j':
        units.push({ kind: 'C', ph: 'x' });
        break;
      case 'b':
      case 'v':
        units.push({ kind: 'X', ph: 'B' });
        break;
      case 'd':
        units.push({ kind: 'X', ph: 'D' });
        break;
      case 'z':
        units.push({ kind: 'C', ph: 'θ' });
        break;
      case 'l':
        if (next === 'l') {
          units.push({ kind: 'C', ph: 'ʎ' });
          i++;
        } else units.push({ kind: 'C', ph: 'l' });
        break;
      case 'ñ':
        units.push({ kind: 'C', ph: 'ɲ' });
        break;
      case 'r':
        if (next === 'r') {
          units.push({ kind: 'C', ph: 'r' });
          i++;
        } else if (i === 0 || ['n', 'l', 's'].includes(at(i - 1))) units.push({ kind: 'C', ph: 'r' });
        else units.push({ kind: 'C', ph: 'ɾ' });
        break;
      case 'x':
        units.push({ kind: 'C', ph: 'k' }, { kind: 'C', ph: 's' });
        break;
      case 'n':
        units.push({ kind: 'X', ph: 'N' });
        break;
      case 'w':
        units.push({ kind: 'C', ph: 'w' });
        break;
      case 'k':
      case 'f':
      case 'm':
      case 'p':
      case 's':
      case 't':
        units.push({ kind: 'C', ph: ch });
        break;
      default:
        break;
    }
  }
  return units;
}

/**
 * Phonemes of one word: glides in diphthongs, then stress. `stress` is 'primary', 'secondary' or 'none'
 * (unstressed function words).
 */
function wordSegments(word: string, stress: 'primary' | 'secondary' | 'none'): Segment[] {
  const units = wordUnits(word);
  // Mark each vowel as a syllable nucleus or a glide.
  const nucleus: boolean[] = units.map(() => false);
  const glide: string[] = units.map(() => '');
  for (let start = 0; start < units.length; start++) {
    if (units[start].kind !== 'V') continue;
    let end = start;
    while (units[end + 1]?.kind === 'V') end++;
    const run = units.slice(start, end + 1) as Extract<Unit, { kind: 'V' }>[];
    const full = run.map((v) => !v.weak || v.accent);
    if (!full.some(Boolean)) {
      // Only weak vowels (iu, ui): the first glides, except a final y, which is itself the glide (muy).
      if (run.length > 1 && run[run.length - 1].letter === 'y') full[run.length - 2] = true;
      else full[run.length - 1] = true;
    }
    // After an l or r that starts the word or follows a consonant (luego, cliente, pruebas, ruido), a weak
    // vowel before another vowel keeps its own syllable.
    const prev = units[start - 1];
    const beforePrev = units[start - 2];
    if (prev?.kind === 'C' && ['l', 'ɾ', 'r'].includes(prev.ph) && (!beforePrev || beforePrev.kind !== 'V') && run.length > 1) {
      full[0] = true;
    }
    run.forEach((v, k) => {
      const index = start + k;
      if (full[k]) {
        nucleus[index] = true;
        return;
      }
      const before = k > 0 && full[k - 1];
      const after = k < run.length - 1 && full[k + 1];
      if (after && !before) glide[index] = v.ph === 'i' ? 'j' : 'w';
      else if (before) {
        const host = run[k - 1].ph;
        glide[index] = host === 'u' || host === 'i' ? (v.ph === 'i' ? 'j' : 'w') : v.ph === 'i' ? 'ɪ' : 'ʊ';
      } else nucleus[index] = true;
    });
    start = end;
  }

  const nuclei = units.map((_, i) => i).filter((i) => nucleus[i]);
  let stressed = nuclei.find((i) => (units[i] as { accent?: boolean }).accent) ?? -1;
  if (stressed < 0 && nuclei.length) {
    const lastLetter = word[word.length - 1];
    const penultimate = /[aeiouns]$/.test(lastLetter) && lastLetter !== 'y';
    stressed = nuclei.length > 1 && penultimate ? nuclei[nuclei.length - 2] : nuclei[nuclei.length - 1];
  }
  const stressIndex = nuclei.indexOf(stressed);

  const segments: Segment[] = [];
  units.forEach((unit, i) => {
    if (unit.kind === 'C') segments.push({ ph: unit.ph, kind: 'C' });
    else if (unit.kind === 'X') segments.push({ ph: unit.ph, kind: 'X' });
    else if (!nucleus[i]) segments.push({ ph: glide[i], kind: 'G' });
    else {
      let ph = unit.ph;
      if (i === stressed && stress !== 'none') {
        segments.push({ ph: stress === 'primary' ? 'ˈ' : 'ˌ', kind: 'M' });
        // Stressed e opens before a nasal + consonant (tengo, gente, siento).
        const n1 = units[i + 1];
        const n2 = units[i + 2];
        if (ph === 'e' && n1?.kind === 'X' && n1.ph === 'N' && n2 && n2.kind !== 'V') ph = 'ɛ';
      } else if (stress === 'primary') {
        // Secondary stress on alternate syllables from the start, short of the one before the primary.
        const index = nuclei.indexOf(i);
        if (index >= 0 && index % 2 === 0 && index < stressIndex - 1) segments.push({ ph: 'ˌ', kind: 'M' });
      }
      segments.push({ ph, kind: 'V' });
    }
  });
  // A b or d that ends the word stays a stop (Madrid, usted, web).
  const last = segments[segments.length - 1];
  if (last?.kind === 'X' && (last.ph === 'D' || last.ph === 'B')) segments[segments.length - 1] = { ph: last.ph === 'D' ? 'd' : 'b', kind: 'C' };
  return segments;
}

/** Adverbs in -mente keep the adjective's stress and add their own (ciertamente → θjˈeɾtamˈente). */
function wordWithStress(word: string, stress: 'primary' | 'secondary' | 'none'): Segment[] {
  if (stress === 'primary' && word.length > 7 && word.endsWith('mente')) {
    return [...wordSegments(word.slice(0, -5), 'primary'), ...wordSegments('mente', 'primary').map((s) => (s.ph === 'ɛ' ? { ...s, ph: 'e' } : s))];
  }
  return wordSegments(word, stress);
}

/** Resolve b/d/g and n from their neighbours across the whole phrase. */
function resolvePhrase(words: Segment[][]): string[] {
  const flat: (Segment & { word: number })[] = words.flatMap((segments, word) => segments.map((s) => ({ ...s, word })));
  const phoneAt = (i: number, step: -1 | 1) => {
    for (let j = i + step; j >= 0 && j < flat.length; j += step) if (flat[j].kind !== 'M') return flat[j];
    return null;
  };
  for (let i = 0; i < flat.length; i++) {
    const seg = flat[i];
    if (seg.kind !== 'X') continue;
    const prev = phoneAt(i, -1);
    const prevPh = prev?.ph ?? '';
    const afterNasal = NASALS.has(prevPh) || prevPh === 'N';
    if (seg.ph === 'B') seg.ph = !prev || afterNasal ? 'b' : 'β';
    else if (seg.ph === 'D') seg.ph = !prev || afterNasal || prevPh === 'l' ? 'd' : 'ð';
    else if (seg.ph === 'G') seg.ph = !prev || afterNasal ? 'ɡ' : 'ɣ';
    else {
      const next = phoneAt(i, 1)?.ph ?? '';
      seg.ph = ['B', 'b', 'p', 'β'].includes(next) ? 'm' : ['G', 'ɡ', 'ɣ', 'x'].includes(next) ? 'ŋ' : 'n';
    }
    seg.kind = 'C';
  }
  return words.map((_, w) => flat.filter((s) => s.word === w).map((s) => s.ph).join(''));
}

const WORD = /[a-záéíóúüñ]+|\d+/g;

/** One clause (no internal punctuation) → phoneme words. */
function phonemizeClause(clause: string): string {
  const words = (clause.match(WORD) ?? []).flatMap((w) => (/^\d+$/.test(w) ? spanishNumber(Number(w)).split(' ') : [w]));
  if (!words.length) return '';
  const single = words.length === 1;
  const segmentsPerWord = words.map((word) => {
    const exception = EXCEPTIONS[word];
    if (exception) return [{ ph: exception, kind: 'C' as const }];
    const stress = single ? 'primary' : UNSTRESSED.has(word) ? 'none' : SECONDARY.has(word) ? 'secondary' : 'primary';
    return wordWithStress(word, stress);
  });
  return resolvePhrase(segmentsPerWord).filter(Boolean).join(' ');
}

/**
 * Spanish text → phoneme strings, one per sentence, with clause punctuation kept the way Piper keeps it
 * (`"ˈola, kˈomo estˈas?"`).
 */
export function phonemizeSpanish(text: string): string[] {
  const normalized = text.normalize('NFC').toLowerCase().replace(/[¿¡«»"“”()[\]]/g, ' ').replace(/…/g, '.');
  const sentences: string[] = [];
  let current = '';
  for (const part of normalized.split(/([.,;:!?]+)/)) {
    if (!part) continue;
    if (/^[.,;:!?]+$/.test(part)) {
      const mark = part.includes('?') ? '?' : part.includes('!') ? '!' : part[0];
      if (!current.trim()) continue;
      current = current.trimEnd() + mark;
      if ('.!?'.includes(mark)) {
        sentences.push(current.trim());
        current = '';
      } else current += ' ';
      continue;
    }
    const phonemes = phonemizeClause(part);
    if (phonemes) current += phonemes;
  }
  if (current.trim()) sentences.push(current.trim());
  return sentences;
}

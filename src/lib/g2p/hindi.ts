/**
 * Hindi (Devanagari) text → eSpeak-style IPA, for Piper voices trained on eSpeak NG phonemes (`espeak.voice: "hi"`).
 *
 * Devanagari is close to phonemic; the main work is the inherent vowel. Each consonant carries a schwa unless a
 * virama or vowel sign replaces it, and spoken Hindi drops many of those schwas: at the end of a word (राम → raːm)
 * and between a vowel–consonant and a consonant–vowel (कमरा → kʌmɾaː). Anusvara becomes a nasal consonant before a
 * stop (ठंडा → ʈʰʌɳɖaː) and nasalises the vowel elsewhere (हैं → hɛ̃). Stress follows syllable weight, as eSpeak does.
 */

type Vowel = { kind: 'V'; ph: string; inherent: boolean; deleted?: boolean; nasal?: boolean };
type Consonant = { kind: 'C'; ph: string };
/** Anusvara, resolved once the next sound is known. */
type Anusvara = { kind: 'N' };
type Unit = Vowel | Consonant | Anusvara;

const CONSONANTS: Record<string, string> = {
  क: 'k', ख: 'kʰ', ग: 'ɡ', घ: 'ɡʰ', ङ: 'ŋ',
  च: 'c', छ: 'cʰ', ज: 'ɟ', झ: 'ɟʰ', ञ: 'ɲ',
  ट: 'ʈ', ठ: 'ʈʰ', ड: 'ɖ', ढ: 'ɖʰ', ण: 'ɳ',
  त: 't', थ: 'tʰ', द: 'd', ध: 'dʰ', न: 'n', ऩ: 'n',
  प: 'p', फ: 'pʰ', ब: 'b', भ: 'bʰ', म: 'm',
  य: 'j', र: 'ɾ', ऱ: 'ɾ', ल: 'l', ळ: 'ɭ', व: 'ʋ',
  श: 'ʃ', ष: 'ʂ', स: 's', ह: 'h',
};
/** Consonants written with a nukta (both the precomposed letters and base + ़). */
const NUKTA: Record<string, string> = {
  क: 'q', ख: 'x', ग: 'ɣ', ज: 'z', ड: 'r.', ढ: 'r.h', फ: 'f', य: 'j', ऩ: 'n', ऱ: 'ɾ', ळ: 'ɭ',
};
const PRECOMPOSED_NUKTA: Record<string, string> = {
  'क़': 'क', 'ख़': 'ख', 'ग़': 'ग', 'ज़': 'ज', 'ड़': 'ड', 'ढ़': 'ढ', 'फ़': 'फ', 'य़': 'य',
};
const INDEPENDENT_VOWELS: Record<string, string> = {
  अ: 'ə', आ: 'aː', इ: 'ɪ', ई: 'iː', उ: 'ʊ', ऊ: 'uː', ऋ: 'ɾɪ', ए: 'eː', ऐ: 'ɛː', ओ: 'oː', औ: 'ɔː', ऑ: 'ɔ', ऍ: 'ɛ',
};
const VOWEL_SIGNS: Record<string, string> = {
  'ा': 'aː', 'ि': 'ɪ', 'ी': 'iː', 'ु': 'ʊ', 'ू': 'uː', 'ृ': 'ɾɪ', 'े': 'eː', 'ै': 'ɛː', 'ो': 'oː', 'ौ': 'ɔː', 'ॉ': 'ɔ', 'ॅ': 'ɛ',
};
const VIRAMA = '्';
const NUKTA_SIGN = '़';
const ANUSVARA = 'ं';
const CHANDRABINDU = 'ँ';
const VISARGA = 'ः';

/** Nasal that matches a following stop, for anusvara and chandrabindu. */
function homorganicNasal(ph: string): string | null {
  const base = ph.replace('ʰ', '');
  if (['k', 'ɡ', 'q'].includes(base)) return 'ŋ';
  if (['c', 'ɟ'].includes(base)) return 'ɲ';
  if (['ʈ', 'ɖ'].includes(base)) return 'ɳ';
  if (['t', 'd'].includes(base)) return 'n';
  if (['p', 'b'].includes(base)) return 'm';
  return null;
}

const NASALISED: Record<string, string> = {
  'aː': 'ã', 'iː': 'ĩ', 'uː': 'ũ', 'ɪ': 'ĩ', 'ʊ': 'ũ', 'ə': 'ə̃', 'eː': 'ẽː', 'ɛː': 'ɛ̃', 'oː': 'õ', 'ɔː': 'ɔ̃', 'ɔ': 'ɔ̃', 'ɛ': 'ɛ̃',
};
const LONG = new Set(['aː', 'iː', 'uː', 'eː', 'ɛː', 'oː', 'ɔː', 'ã', 'ĩ', 'ũ', 'ẽː', 'ɛ̃', 'õ', 'ɔ̃']);

/** Words eSpeak leaves unstressed, or gives only secondary stress, in a phrase. */
const UNSTRESSED = new Set(['है', 'हैं', 'हूँ', 'हो', 'मैं', 'और', 'का', 'की', 'के', 'को', 'से', 'वे', 'ये', 'था', 'थी', 'थे', 'क्या', 'तू']);
const SECONDARY = new Set([
  'यह', 'वह', 'तुम', 'हम', 'तक', 'मेरा', 'मेरी', 'मेरे', 'इसका', 'उसका', 'इसकी', 'उसकी', 'इसके', 'उसके', 'आपका', 'आपकी', 'आपके',
]);
const PLOSIVES = new Set(['k', 'ɡ', 'c', 'ɟ', 'ʈ', 'ɖ', 't', 'd', 'p', 'b', 'q']);

const DIGITS = ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ'];

/** Letters of one word → units, with every inherent schwa still present. */
function parseWord(word: string): Unit[] {
  const chars = [...word.normalize('NFC')].flatMap((ch) => (PRECOMPOSED_NUKTA[ch] ? [PRECOMPOSED_NUKTA[ch], NUKTA_SIGN] : [ch]));
  const units: Unit[] = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (CONSONANTS[ch]) {
      let ph = CONSONANTS[ch];
      if (chars[i + 1] === NUKTA_SIGN) {
        ph = NUKTA[ch] ?? ph;
        i++;
      }
      // क्ष is kʃ, ज्ञ is ɡj.
      const prev = units[units.length - 1];
      if (ch === 'ष' && prev?.kind === 'C' && prev.ph === 'k') ph = 'ʃ';
      if (ch === 'ञ' && prev?.kind === 'C' && prev.ph === 'ɟ') {
        prev.ph = 'ɡ';
        ph = 'j';
      }
      // A doubled stop is long (कुत्ता → kʊtːaː); before its aspirated pair it is aspirated too (अच्छा → ʌcʰcʰaː).
      const prevUnit = units[units.length - 1];
      if (prevUnit?.kind === 'C' && chars[i - 1] === VIRAMA && PLOSIVES.has(prevUnit.ph)) {
        if (prevUnit.ph === ph && !['ʈ', 'ɖ'].includes(ph)) {
          prevUnit.ph += 'ː';
          ph = '';
        } else if (`${prevUnit.ph}ʰ` === ph) prevUnit.ph = ph;
      }
      // eSpeak lengthens a word-initial k or p before y (क्या → kːjaː, प्यार → pːjaːɾ).
      if (ph === 'j' && units.length === 1 && prevUnit?.kind === 'C' && (prevUnit.ph === 'k' || prevUnit.ph === 'p')) prevUnit.ph += 'ː';
      if (ph) units.push({ kind: 'C', ph });
      const next = chars[i + 1];
      if (next === VIRAMA) {
        // र् before a consonant is a trilled r (मार्मिक → maːrmɪk).
        const own = units[units.length - 1];
        if (ph === 'ɾ' && own?.kind === 'C' && chars[i + 2] && CONSONANTS[chars[i + 2]]) own.ph = 'r';
        i++;
      } else if (next && VOWEL_SIGNS[next]) {
        const sign = VOWEL_SIGNS[next];
        if (sign === 'ɾɪ') units.push({ kind: 'C', ph: 'ɾ' }, { kind: 'V', ph: 'ɪ', inherent: false });
        else units.push({ kind: 'V', ph: sign, inherent: false });
        i++;
      } else {
        units.push({ kind: 'V', ph: 'ə', inherent: true });
      }
    } else if (INDEPENDENT_VOWELS[ch]) {
      const ph = INDEPENDENT_VOWELS[ch];
      if (ph === 'ɾɪ') units.push({ kind: 'C', ph: 'ɾ' }, { kind: 'V', ph: 'ɪ', inherent: false });
      // Independent अ is always the open ʌ (अमरीका → ʌmɾiːkaː).
      else units.push({ kind: 'V', ph: ph === 'ə' ? 'ʌ' : ph, inherent: false });
    } else if (ch === ANUSVARA) {
      units.push({ kind: 'N' });
    } else if (ch === CHANDRABINDU) {
      const prev = units[units.length - 1];
      if (prev?.kind === 'V') prev.nasal = true;
    } else if (ch === VISARGA) {
      units.push({ kind: 'C', ph: 'h' });
    }
  }
  return units;
}

const isVowel = (u: Unit | undefined): u is Vowel => u?.kind === 'V' && !u.deleted;
const isConsonant = (u: Unit | undefined): u is Consonant => u?.kind === 'C';

/**
 * Anusvara after a short a/u is a nasal consonant before another consonant (ठंडा → ʈʰʌɳɖaː, संसाधन → sənsaːdʰən);
 * elsewhere it nasalises the vowel (हैं → hɛ̃, लेंगे → lẽːɡeː). Chandrabindu nasalises the vowel and adds n before a
 * stop (पाँच → pãnc); on a short a it is just n (महँगा → məhʌnɡaː).
 */
function resolveNasals(units: Unit[]): Unit[] {
  const out: Unit[] = [];
  units.forEach((unit, i) => {
    const next = units[i + 1];
    if (unit.kind === 'V' && unit.nasal) {
      if (unit.ph === 'ə' && isConsonant(next)) {
        unit.nasal = false;
        out.push(unit, { kind: 'C', ph: 'n' });
        return;
      }
      out.push(unit);
      if (isConsonant(next) && homorganicNasal(next.ph)) out.push({ kind: 'C', ph: 'n' });
      return;
    }
    if (unit.kind !== 'N') {
      out.push(unit);
      return;
    }
    const prev = out[out.length - 1];
    const short = prev?.kind === 'V' && (prev.ph === 'ə' || prev.ph === 'ʌ' || prev.ph === 'ʊ');
    if (short && isConsonant(next)) out.push({ kind: 'C', ph: homorganicNasal(next.ph) ?? 'n' });
    else if (prev?.kind === 'V') prev.nasal = true;
    else if (isConsonant(next)) out.push({ kind: 'C', ph: homorganicNasal(next.ph) ?? 'n' });
  });
  return out;
}

/** Drop the inherent schwas that spoken Hindi leaves out. */
function deleteSchwas(units: Unit[]): void {
  const vowels = units.filter((u) => u.kind === 'V');
  const last = units[units.length - 1];
  if (vowels.length > 1 && last?.kind === 'V' && last.inherent && !last.nasal) {
    // Keep it after a conjunct ending in a sonorant (फ़िल्म → fɪlmə), but not after r (धर्म).
    const c2 = units[units.length - 2];
    const c1 = units[units.length - 3];
    const sonorantCluster = isConsonant(c1) && isConsonant(c2) && ['j', 'ɾ', 'ʋ', 'm', 'n', 'ɳ'].includes(c2.ph) && c1.ph !== 'ɾ';
    if (!sonorantCluster) last.deleted = true;
  }
  // Right to left: V C ə C V → V C C V, unless the next vowel is another schwa (परिवहन → pʌɾɪʋəhən).
  // A schwa after h stays (रहता → ɾʌhətaː).
  for (let i = units.length - 2; i >= 2; i--) {
    const unit = units[i];
    if (unit.kind !== 'V' || !unit.inherent || unit.nasal || unit.deleted) continue;
    const before = units[i - 1];
    const after = units[i + 2];
    if (
      isConsonant(before) && before.ph !== 'h' && isVowel(units[i - 2]) && isConsonant(units[i + 1]) &&
      isVowel(after) && !after.inherent
    ) {
      unit.deleted = true;
    }
  }
}

type Syllable = { onset: string[]; vowel: Vowel; coda: string[] };

function syllables(units: Unit[]): Syllable[] {
  const live = units.filter((u) => u.kind === 'C' || isVowel(u)) as (Vowel | Consonant)[];
  const result: Syllable[] = [];
  let pending: string[] = [];
  live.forEach((unit, i) => {
    if (unit.kind === 'C') {
      pending.push(unit.ph);
      return;
    }
    // Between vowels, the last consonant starts the next syllable; the rest close the previous one.
    if (result.length && pending.length > 1) result[result.length - 1].coda.push(...pending.slice(0, -1));
    result.push({ onset: result.length ? pending.slice(-1) : pending, vowel: unit, coda: [] });
    pending = [];
    if (i === live.length - 1) pending = [];
  });
  if (result.length) result[result.length - 1].coda.push(...pending);
  else if (pending.length) result.push({ onset: pending, vowel: { kind: 'V', ph: '', inherent: false }, coda: [] });
  return result;
}

/**
 * Stress the heaviest part of the word: a final syllable with a long vowel and a closing consonant, otherwise
 * the last heavy syllable before it (long vowel or closed), otherwise the first.
 */
function stressedSyllable(sylls: Syllable[]): number {
  if (sylls.length <= 1) return 0;
  const isLong = (s: Syllable) => LONG.has(s.vowel.ph);
  const final = sylls[sylls.length - 1];
  if ((isLong(final) && final.coda.length) || final.coda.length > 1) return sylls.length - 1;
  for (let i = sylls.length - 2; i >= 0; i--) if (isLong(sylls[i]) || sylls[i].coda.length) return i;
  return 0;
}

function phonemizeWord(word: string, stress: 'primary' | 'secondary' | 'none'): string {
  if (/^[0-9०-९]+$/.test(word)) {
    return [...word]
      .map((d) => DIGITS[/[0-9]/.test(d) ? Number(d) : '०१२३४५६७८९'.indexOf(d)])
      .map((name) => phonemizeWord(name, 'primary'))
      .join(' ');
  }
  const units = resolveNasals(parseWord(word));
  deleteSchwas(units);

  // Vowel adjustments: nasalisation, a short final ई/ऊ, and a final -əy as ɛj (समय → sʌmɛj).
  const live = units.filter((u) => u.kind === 'C' || isVowel(u));
  live.forEach((unit, i) => {
    if (unit.kind !== 'V') return;
    if (unit.nasal) unit.ph = NASALISED[unit.ph] ?? unit.ph;
    if (i === live.length - 1 && (unit.ph === 'iː' || unit.ph === 'uː')) unit.ph = unit.ph[0];
  });
  // A final एँ after a vowel is a glide (दाएँ → daːj).
  const final = live[live.length - 1];
  if (final?.kind === 'V' && final.ph === 'ẽː' && live[live.length - 2]?.kind === 'V') {
    Object.assign(final, { kind: 'C', ph: 'j' });
  }
  const lastTwo = live.slice(-2);
  if (live.length > 2 && lastTwo[0].kind === 'V' && lastTwo[0].ph === 'ə' && lastTwo[1].kind === 'C' && lastTwo[1].ph === 'j') {
    lastTwo[0].ph = 'ɛ';
  }

  const sylls = syllables(units);
  const primary = stress === 'none' ? -1 : stressedSyllable(sylls);
  return sylls
    .map((s, i) => {
      let vowel = s.vowel.ph;
      let mark = '';
      if (i === primary) {
        mark = stress === 'primary' ? 'ˈ' : 'ˌ';
        // A stressed inherent vowel is ʌ, except a lone letter's (क → kˈə).
        if (stress === 'primary' && vowel === 'ə' && !(sylls.length === 1 && !s.coda.length)) vowel = 'ʌ';
      } else if (stress === 'primary' && i === 0 && primary >= 1 && (primary >= 2 || LONG.has(vowel) || s.coda.length)) {
        mark = 'ˌ';
      }
      return s.onset.join('') + mark + vowel + s.coda.join('');
    })
    .join('');
}

const TOKEN = /[ऀ-ॣ०-ॿ]+|[0-9]+|[।॥.,;:!?]/g;

/**
 * Hindi text → phoneme strings, one per sentence, with clause punctuation kept the way Piper keeps it.
 * Text outside Devanagari (such as Latin letters) is skipped.
 */
export function phonemizeHindi(text: string): string[] {
  const tokens = text.normalize('NFC').match(TOKEN) ?? [];
  const sentences: string[] = [];
  let current: string[] = [];
  const flush = (mark: string) => {
    if (!current.length) return;
    sentences.push(current.join(' ') + mark);
    current = [];
  };
  for (const token of tokens) {
    if (token === '।' || token === '॥' || token === '.' || token === '!' || token === '?') {
      flush(token === '!' || token === '?' ? token : '.');
    } else if (/^[,;:]$/.test(token)) {
      if (current.length) current[current.length - 1] += token;
    } else {
      const stress = UNSTRESSED.has(token) ? 'none' : SECONDARY.has(token) ? 'secondary' : 'primary';
      const phonemes = phonemizeWord(token, stress);
      if (phonemes) current.push(phonemes);
    }
  }
  flush('');
  return sentences;
}

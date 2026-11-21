/**
 * Standard German text → eSpeak-style IPA, for Piper voices trained on eSpeak NG phonemes (`espeak.voice: "de"`).
 *
 * German spelling is mostly predictable once vowel length and stress are known. The rules here cover what the
 * course needs: long vowels before a single consonant, h or ß and in open syllables; short vowels before
 * consonant clusters; ch as ç or x; sch, sp-/st-, z, v, w; final devoicing; -er as ɐ and unstressed e as ə;
 * stress on the first syllable of the stem, after unstressed prefixes (be-, ge-, ver- …), or on endings that
 * attract it (-ieren, -ion, -tät). Words the rules get wrong, mostly loanwords and names, are listed whole.
 * The output marks stress before the stressed vowel, as eSpeak does.
 */

/** Whole-word pronunciations: loanwords, names and words whose length or stress the rules miss. */
const EXCEPTIONS: Record<string, string> = {
  hotel: 'hotˈɛl',
  café: 'kafˈeː',
  cafe: 'kafˈeː',
  kaffee: 'kˈafeː',
  orange: 'oʁˈɑ̃ʒə',
  restaurant: 'ʁɛstoʁˈɑ̃',
  büro: 'byʁˈoː',
  museum: 'muzˈeːʊm',
  team: 'tˈiːm',
  homeoffice: 'hˈoːmʔɔfɪs',
  gate: 'ɡˈeːt',
  boarding: 'bˈoːɐdɪŋ',
  wlan: 'vˈeːlaːn',
  passwort: 'pˈasvɔʁt',
  familie: 'famˈiːliə',
  toilette: 'toalˈɛtə',
  euro: 'ˈɔøʁo',
  kilo: 'kˈiːlo',
  tomaten: 'tomˈaːtən',
  doktor: 'dˈɔktoːɐ',
  termin: 'tɛʁmˈiːn',
  kassenbon: 'kˈasənbɔŋ',
  berlin: 'bɛʁlˈiːn',
  paul: 'pˈaʊl',
  jonas: 'jˈoːnas',
  alex: 'ˈalɛks',
  tom: 'tˈɔm',
  lena: 'lˈeːna',
  max: 'mˈaks',
  hamburg: 'hˈambʊʁk',
  frankfurt: 'fʁˈaŋkfʊʁt',
  wien: 'vˈiːn',
  münchen: 'mˈʏnçən',
  linde: 'lˈɪndə',
  hypothese: 'hypotˈeːzə',
  ressource: 'ʁɛsˈʊʁsə',
  ressourcenverbrauch: 'ʁɛsˈʊʁsənfɛɐbʁaʊx',
  protokoll: 'pʁotokˈɔl',
  generation: 'ɡeneʁatsjˈoːn',
  generationen: 'ɡeneʁatsjˈoːnən',
  priorität: 'pʁioʁitˈɛːt',
  prioritäten: 'pʁioʁitˈɛːtən',
  option: 'ɔptsjˈoːn',
  spaziergang: 'ʃpatsˈiːɐɡaŋ',
  daten: 'dˈaːtən',
  buch: 'bˈuːx',
  nach: 'nˈaːx',
  danach: 'danˈaːx',
  dabei: 'dabˈaɪ',
  darum: 'daʁˈʊm',
  vorbei: 'foːɐbˈaɪ',
  herein: 'hɛʁˈaɪn',
  heraus: 'hɛʁˈaʊs',
  herausforderung: 'hɛʁˈaʊsfɔʁdəʁʊŋ',
  infrage: 'ɪnfʁˈaːɡə',
  zurück: 'tsuʁˈʏk',
  zuerst: 'tsuˈeːɐst',
  zusammen: 'tsuzˈamən',
  natürlich: 'natˈyːɐlɪç',
  vielleicht: 'filˈaɪçt',
  allerdings: 'ˈalɐdɪŋs',
  jedoch: 'jedˈɔx',
  obwohl: 'ɔpvˈoːl',
  warum: 'vaʁˈʊm',
  woche: 'vˈɔxə',
  wochenende: 'vˈɔxənʔɛndə',
  erdbeeren: 'ˈeːɐtbeːʁən',
  rotwein: 'ʁˈoːtvaɪn',
  montagmorgen: 'mˈoːntaːkmɔʁɡən',
  nahverkehr: 'nˈaːfɛɐkeːɐ',
  artenvielfalt: 'ˈaʁtənfiːlfalt',
  klimaschutz: 'klˈiːmaʃʊts',
  hafenstadt: 'hˈaːfənʃtat',
  'u-bahn': 'ˈuːbaːn',
  mädchen: 'mˈɛːtçən',
  tschüss: 'tʃˈʏs',
  gern: 'ɡˈɛʁn',
  gerne: 'ɡˈɛʁnə',
  hätte: 'hˈɛtə',
  heute: 'hˈɔøtə',
  bitte: 'bˈɪtə',
  danke: 'dˈaŋkə',
  hallo: 'halˈoː',
  ja: 'jˈaː',
  nein: 'nˈaɪn',
  okay: 'okˈeː',
  fieber: 'fˈiːbɐ',
  tabletten: 'tablˈɛtən',
  schale: 'ʃˈaːlə',
  koffer: 'kˈɔfɐ',
  gepäck: 'ɡəpˈɛk',
  personen: 'pɛʁzˈoːnən',
  kunden: 'kˈʊndən',
  regel: 'ʁˈeːɡəl',
  zwölf: 'tsvˈœlf',
  prozent: 'pʁotsˈɛnt',
  gegen: 'ɡˈeːɡən',
  gestern: 'ɡˈɛstɐn',
  geben: 'ɡˈeːbən',
  erste: 'ˈeːɐstə',
  erster: 'ˈeːɐstɐ',
  ersten: 'ˈeːɐstən',
  beste: 'bˈɛstə',
  besten: 'bˈɛstən',
  besucht: 'bəzˈuːxt',
  besuchen: 'bəzˈuːxən',
  geregnet: 'ɡəʁˈeːɡnət',
  regnet: 'ʁˈeːɡnət',
  notwendig: 'nˈoːtvɛndɪç',
  werden: 'vˈeːɐdən',
  wert: 'vˈeːɐt',
  roman: 'ʁomˈaːn',
  flugzeug: 'flˈuːktsɔøk',
  gibt: 'ɡˈiːpt',
  brötchen: 'bʁˈøːtçən',
  lädt: 'lˈɛːt',
  minuten: 'minˈuːtən',
  idee: 'idˈeː',
  vorschlag: 'fˈoːɐʃlaːk',
  vorschlags: 'fˈoːɐʃlaːks',
  überprüft: 'yːbɐpʁˈyːft',
  überprüfen: 'yːbɐpʁˈyːfən',
  reservieren: 'ʁezɛʁvˈiːʁən',
  reserviere: 'ʁezɛʁvˈiːʁə',
  relativieren: 'ʁelativˈiːʁən',
  hey: 'hˈeɪ',
  gehen: 'ɡˈeːən',
  gemütlich: 'ɡəmˈyːtlɪç',
  ergebnisse: 'ɛɐɡˈeːpnɪsə',
  bewegt: 'bəvˈeːkt',
  wiedersehen: 'vˈiːdɐzeːən',
  kopfschmerzen: 'kˈɔpfʃmɛʁtsən',
  abends: 'ˈaːbənts',
  etwas: 'ˈɛtvas',
  dreizehn: 'dʁˈaɪtseːn',
  vierzehn: 'fˈɪʁtseːn',
  fünfzehn: 'fˈʏnftseːn',
  sechzehn: 'zˈɛçtseːn',
  siebzehn: 'zˈiːptseːn',
  achtzehn: 'ˈaxtseːn',
  neunzehn: 'nˈɔøntseːn',
  gehe: 'ɡˈeːə',
  bevorzugen: 'bəfˈoːɐtsuːɡən',
  meinungsverschiedenheit: 'mˈaɪnʊŋsfɛɐʃiːdənhaɪt',
};

/** Words eSpeak leaves unstressed inside a phrase. */
const UNSTRESSED = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
  'und', 'oder', 'aber', 'als', 'wie', 'zu', 'zum', 'zur', 'in', 'im', 'an', 'am', 'auf', 'mit', 'von', 'vom',
  'bei', 'beim', 'aus', 'für', 'um', 'es', 'er', 'sie', 'wir', 'ihr', 'ich', 'du', 'mir', 'dir', 'mich', 'dich',
  'sich', 'uns', 'ist', 'bin', 'sind', 'bist', 'hat', 'hab', 'habe', 'haben', 'wird', 'man', 'so', 'dass', 'wenn',
]);
/** Short words with a short vowel despite ending in a single consonant. */
const SHORT_MONOSYLLABLES = new Set([
  'das', 'was', 'es', 'des', 'in', 'im', 'an', 'am', 'um', 'mit', 'ob', 'ab', 'bis', 'man', 'hat', 'von', 'vom',
  'hin', 'weg', 'wenn', 'dann', 'denn', 'bin', 'bist', 'ist', 'sind', 'un', 'ins', 'drin', 'doch', 'noch', 'ich',
  'mich', 'dich', 'sich', 'auch', 'ach', 'bus', 'plus', 'zum', 'um', 'from',
]);
/** Unstressed prefixes and how they sound. */
const UNSTRESSED_PREFIXES: [string, string][] = [
  ['zer', 'tsɛɐ'], ['ver', 'fɛɐ'], ['emp', 'ɛmp'], ['ent', 'ɛnt'], ['be', 'bə'], ['ge', 'ɡə'], ['er', 'ɛɐ'],
];
/** Stressed separable prefixes: the stress stays on the prefix. */
const STRESSED_PREFIXES = ['zurück', 'nach', 'mit', 'auf', 'aus', 'ein', 'vor', 'weg', 'ab', 'an', 'zu', 'bei'];
/** Endings that take the stress, and how they sound. */
const STRESSED_ENDINGS: [RegExp, string][] = [
  [/ieren$/, 'ˈiːʁən'], [/iert$/, 'ˈiːɐt'], [/ierst$/, 'ˈiːɐst'], [/iere$/, 'ˈiːʁə'],
  [/tionen$/, 'tsjˈoːnən'], [/tion$/, 'tsjˈoːn'], [/tät$/, 'tˈɛːt'], [/täten$/, 'tˈɛːtən'],
];

const VOWELS = 'aeiouäöüy';
const isVowel = (c: string | undefined) => !!c && VOWELS.includes(c);
const SHORT: Record<string, string> = { a: 'a', e: 'ɛ', i: 'ɪ', o: 'ɔ', u: 'ʊ', ä: 'ɛ', ö: 'œ', ü: 'ʏ', y: 'ʏ' };
const LONG: Record<string, string> = { a: 'aː', e: 'eː', i: 'iː', o: 'oː', u: 'uː', ä: 'ɛː', ö: 'øː', ü: 'yː', y: 'yː' };
/** Multi-letter consonant spellings, longest first. */
const CONSONANTS: [string, string][] = [
  ['tsch', 'tʃ'], ['sch', 'ʃ'], ['dt', 't'], ['chs', 'ks'], ['ch', 'Ç'], ['ck', 'k'], ['tz', 'ts'], ['ng', 'ŋ'], ['nk', 'ŋk'],
  ['bb', 'b'], ['dd', 'd'], ['ff', 'f'], ['gg', 'ɡ'], ['kk', 'k'], ['ll', 'l'], ['mm', 'm'], ['nn', 'n'], ['pp', 'p'],
  ['rr', 'R'], ['tt', 't'],
  ['pf', 'pf'], ['ph', 'f'], ['th', 't'], ['qu', 'kv'], ['ss', 's'], ['ß', 's'], ['zw', 'tsv'], ['z', 'ts'],
  ['x', 'ks'], ['v', 'f'], ['w', 'v'], ['j', 'j'], ['c', 'k'],
  ['b', 'b'], ['d', 'd'], ['f', 'f'], ['g', 'ɡ'], ['h', 'h'], ['k', 'k'], ['l', 'l'], ['m', 'm'], ['n', 'n'],
  ['p', 'p'], ['r', 'R'], ['s', 'S'], ['t', 't'],
];
const DOUBLE = /^(bb|dd|ff|gg|kk|ll|mm|nn|pp|rr|tt|ck|tz|ss)/;

type Seg = { ph: string; vowel: boolean; long?: boolean; stressable?: boolean; schwa?: boolean };

/** Letters of one stem (no prefix) → segments, with vowel length decided from the following letters. */
function stemSegments(stem: string, wordFinal: boolean, forceShort = false): Seg[] {
  const segs: Seg[] = [];
  let i = 0;
  while (i < stem.length) {
    const rest = stem.slice(i);
    const c = stem[i];
    if (isVowel(c)) {
      // Diphthongs and ie.
      const two = rest.slice(0, 2);
      if (two === 'ei' || two === 'ai' || two === 'ey' || two === 'ay') { segs.push({ ph: 'aɪ', vowel: true, long: true, stressable: true }); i += 2; continue; }
      if (two === 'au') { segs.push({ ph: 'aʊ', vowel: true, long: true, stressable: true }); i += 2; continue; }
      if (two === 'eu' || two === 'äu') { segs.push({ ph: 'ɔø', vowel: true, long: true, stressable: true }); i += 2; continue; }
      if (two === 'ie') {
        // -ie at the very end after a consonant is usually iː (Energie); before -n it stays iː.
        segs.push({ ph: 'iː', vowel: true, long: true, stressable: true });
        i += 2;
        if (stem[i] === 'h') i++;
        continue;
      }
      if (two === 'aa' || two === 'ee' || two === 'oo') { segs.push({ ph: LONG[c], vowel: true, long: true, stressable: true }); i += 2; continue; }
      const next = stem.slice(i + 1);
      let long: boolean;
      if (next.startsWith('h')) {
        long = true;
        i++; // silent lengthening h
      } else if (next.startsWith('ß')) long = true;
      else if (DOUBLE.test(next) || /^(sch|ch|ng|nk|x|pf|tsch)/.test(next)) long = false;
      else if (next === '') long = true;
      else {
        // Count consonant letters before the next vowel.
        let k = 0;
        while (k < next.length && !isVowel(next[k])) k++;
        if (k === next.length) long = k === 1 && wordFinal; // one final consonant: long by default (Tag, gut)
        else long = k <= 1;
      }
      if (forceShort) long = false;
      segs.push({ ph: long ? LONG[c] : SHORT[c], vowel: true, long, stressable: true, schwa: c === 'e' });
      i++;
      continue;
    }
    const match = CONSONANTS.find(([spelling]) => rest.startsWith(spelling));
    if (!match) { i++; continue; }
    segs.push({ ph: match[1], vowel: false });
    i += match[0].length;
  }
  return segs;
}

/** Resolve context-dependent consonants (ch, r, s) and final devoicing. */
function resolveConsonants(segs: Seg[], wordStart: boolean): void {
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    const prev = segs[i - 1];
    const next = segs[i + 1];
    if (s.ph === 'Ç') s.ph = prev && /^(a|aː|ɔ|oː|ʊ|uː|aʊ)$/.test(prev.ph) ? 'x' : 'ç';
    else if (s.ph === 'S') {
      if (wordStart && i === 0 && next && (next.ph === 'p' || next.ph === 't')) s.ph = 'ʃ';
      else if (next?.vowel && (!prev || prev.vowel || /^(l|m|n|ŋ|R)$/.test(prev.ph))) s.ph = 'z';
      else s.ph = 's';
    } else if (s.ph === 'R') {
      if (next?.vowel) s.ph = 'ʁ';
      else if (prev?.vowel && prev.long) s.ph = 'ɐ';
      else s.ph = 'ʁ';
    } else if (s.ph === 'h' && prev?.vowel) s.ph = '';
  }
  // Final devoicing: b d ɡ before the end of the word or before another obstruent.
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    const next = segs[i + 1];
    // Syllable-final b d ɡ lose their voice, also before -lich, -lung and similar (freundlich, Handlung).
    const devoice = !next || (!next.vowel && /^(t|s|z|ts|k|p|f|ʃ|l|m|n|ɡ|b|d|v)$/.test(next.ph));
    if (devoice && s.ph === 'b') s.ph = 'p';
    else if (devoice && s.ph === 'd') s.ph = 't';
    else if (devoice && s.ph === 'ɡ') s.ph = 'k';
    else if (devoice && s.ph === 'z') s.ph = 's';
  }
}

/** -ig at the end of a stem (or before -s, -t, -st) is ɪç. */
function applyIg(segs: Seg[]): void {
  for (let i = 1; i < segs.length; i++) {
    const v = segs[i - 1];
    const s = segs[i];
    const rest = segs.slice(i + 1);
    if (v.vowel && (v.ph === 'ɪ' || v.ph === 'iː') && s.ph === 'ɡ' && (rest.length === 0 || !rest[0].vowel)) {
      v.ph = 'ɪ';
      v.long = false;
      s.ph = 'ç';
    }
  }
}

/** Unstressed vowels: e becomes ə, and -er becomes ɐ at the end of a syllable. */
function reduceUnstressed(segs: Seg[], stressed: number): void {
  const vowelIdx = segs.map((s, i) => (s.vowel ? i : -1)).filter((i) => i >= 0);
  for (const vi of vowelIdx) {
    if (vi === stressed) continue;
    const s = segs[vi];
    if (vi > stressed && s.ph === 'iː') {
      s.ph = 'ɪ';
      s.long = false;
    }
    if (!s.schwa) continue;
    const next = segs[vi + 1];
    const afterNext = segs[vi + 2];
    if (next && (next.ph === 'ɐ' || next.ph === 'ʁ') && (!afterNext || !afterNext.vowel)) {
      s.ph = 'ɐ';
      next.ph = '';
    } else s.ph = 'ə';
    s.long = false;
  }
}

function joinSegs(segs: Seg[], stressed: number | null, mark: string): string {
  return segs.map((s, i) => (i === stressed ? mark + s.ph : s.ph)).join('');
}

/** One lower-case word → phonemes. `stress` is the mark to place ('ˈ', 'ˌ' or ''). */
function germanWord(word: string, stress: string): string {
  const exception = EXCEPTIONS[word];
  if (exception) return stress === 'ˈ' ? exception : exception.replace(/ˈ/g, stress);

  for (const [ending, ph] of STRESSED_ENDINGS) {
    if (ending.test(word) && word.replace(ending, '').length >= 2) {
      const stem = word.replace(ending, '');
      const segs = stemSegments(stem, true);
      resolveConsonants(segs, true);
      // Vowels before the stress stay full but short (finanzieren → finantsˈiːʁən).
      for (const seg of segs) if (seg.vowel) seg.ph = seg.ph.replace('ː', '');
      return joinSegs(segs, null, '') + (stress === 'ˈ' ? ph : ph.replace('ˈ', stress));
    }
  }

  let prefix = '';
  let prefixPh = '';
  let prefixStressed = false;
  const unstressedPrefix = UNSTRESSED_PREFIXES.find(([p]) => word.startsWith(p) && word.length > p.length + 2 && isPrefixBoundary(word, p.length));
  if (unstressedPrefix) [prefix, prefixPh] = unstressedPrefix;
  else {
    const stressedPrefix = STRESSED_PREFIXES.find((p) => word.startsWith(p) && word.length > p.length + 3 && isPrefixBoundary(word, p.length));
    if (stressedPrefix) {
      prefix = stressedPrefix;
      prefixStressed = true;
    }
  }

  if (prefixStressed) {
    const head = germanWord(prefix, stress);
    const tail = germanWord(word.slice(prefix.length), '');
    return head + tail;
  }

  const stem = word.slice(prefix.length);
  const segs = stemSegments(stem, true, prefix === '' && SHORT_MONOSYLLABLES.has(word));
  applyIg(segs);
  // The stem starts a morpheme even after a prefix, so sp-/st- stay ʃp/ʃt (bestellen, erstatten).
  resolveConsonants(segs, true);
  const firstVowel = segs.findIndex((s) => s.vowel);
  reduceUnstressed(segs, firstVowel);
  return prefixPh + joinSegs(segs.filter((s) => s.ph !== ''), stressedIndex(segs, firstVowel), stress);
}

/** Index of the stressed vowel after empty (silent) segments are dropped. */
function stressedIndex(segs: Seg[], index: number): number | null {
  if (index < 0) return null;
  return segs.slice(0, index).filter((s) => s.ph !== '').length;
}

/** A prefix only counts if what follows can start a German syllable (avoids splitting "Bett" as be-tt). */
function isPrefixBoundary(word: string, at: number): boolean {
  const rest = word.slice(at);
  if (!rest || DOUBLE.test(rest)) return false;
  const vowelsInRest = (rest.match(/[aeiouäöüy]+/g) ?? []).length;
  return vowelsInRest >= 1 && !/^[^aeiouäöüy]*$/.test(rest);
}

const ONES = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf',
  'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const TENS = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];

/** 0–9999 as German words (written as one word, as German does). */
export function germanNumber(value: number): string {
  if (value < 20) return ONES[value];
  if (value < 100) {
    const unit = value % 10;
    const tens = TENS[Math.floor(value / 10)];
    return unit ? `${unit === 1 ? 'ein' : ONES[unit]}und${tens}` : tens;
  }
  if (value < 1000) {
    const hundreds = Math.floor(value / 100);
    const rest = value % 100;
    return `${hundreds === 1 ? 'ein' : ONES[hundreds]}hundert${rest ? germanNumber(rest) : ''}`;
  }
  const thousands = Math.floor(value / 1000);
  const rest = value % 1000;
  return `${thousands === 1 ? 'ein' : germanNumber(thousands)}tausend${rest ? germanNumber(rest) : ''}`;
}

const WORD = /[a-zäöüßé]+(?:-[a-zäöüßé]+)*|\d+/g;

/** One clause (no internal punctuation) → phoneme words. */
function phonemizeClause(clause: string): string {
  const words = (clause.match(WORD) ?? []).flatMap((w) => {
    if (/^\d+$/.test(w)) return [germanNumber(Math.min(Number(w), 9999))];
    if (w.includes('-') && !EXCEPTIONS[w]) return w.split('-');
    return [w];
  });
  if (!words.length) return '';
  const single = words.length === 1;
  return words
    .map((word) => germanWord(word, single || !UNSTRESSED.has(word) ? 'ˈ' : ''))
    .filter(Boolean)
    .join(' ');
}

/**
 * German text → phoneme strings, one per sentence, with clause punctuation kept the way Piper keeps it
 * (`"halˈoː, vˈiː ɡˈeːt ɛs?"`).
 */
export function phonemizeGerman(text: string): string[] {
  const normalized = text
    .normalize('NFC')
    .toLowerCase()
    .replace(/(\p{L})['’](\p{L})/gu, '$1$2') // geht’s → gehts
    .replace(/[«»"“”„‚‘’()[\]]/g, ' ')
    .replace(/…/g, '.');
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

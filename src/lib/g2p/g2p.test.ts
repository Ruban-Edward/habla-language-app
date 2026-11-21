import { describe, expect, it } from 'vitest';
import { COURSES } from '../../data/courses';
import { encodeEspeakPhonemes } from '../speech';
import { phonemizeHindi } from './hindi';
import { phonemizeSpanish, spanishNumber } from './spanish';

/** Single-codepoint symbols in the Spanish (davefx) and Hindi (rohan) voices' phoneme maps. */
const VOICE_SYMBOLS =
  '_^$ !\'(),-.:;?abcdefhijklmnopqrstuvwxyzæçðøħŋœǀǁǂǃɐɑɒɓɔɕɖɗɘəɚɛɜɞɟɠɡɢɣɤɥɦɧɨɪɫɬɭɮɯɰɱɲɳɴɵɶɸɹɺɻɽɾʀʁʂʃʄʈʉʊʋʌʍʎʏʐʑʒʔʕʘʙʛʜʝʟʡʢʲˈˌːˑ˞βθχᵻⱱ0123456789̧̪̯̩̃ʰˤε↓#"↑̺̻gʦ X̝̊ɝʷ';
const voiceMap: Record<string, number[]> = Object.fromEntries([...VOICE_SYMBOLS].map((symbol, index) => [symbol, [index]]));

function courseTexts(id: string): string[] {
  const course = COURSES.find((c) => c.id === id);
  if (!course) throw new Error(`Missing course ${id}`);
  const texts = new Set<string>([course.hello, ...course.praise]);
  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      lesson.words.forEach((word) => texts.add(word.t));
      lesson.sentences.forEach((sentence) => (Array.isArray(sentence.t) ? sentence.t : [sentence.t]).forEach((t) => texts.add(t)));
    }
    unit.notes?.forEach((note) => note.examples?.forEach((example) => texts.add(example.t)));
  }
  course.missions?.forEach((mission) => mission.turns.forEach((turn) => {
    texts.add(turn.partner.t);
    turn.replies.forEach((reply) => texts.add(reply.t));
  }));
  return [...texts];
}

/** Drop clause punctuation (but not the "." inside eSpeak's r. for ड़). */
const withoutPunctuation = (sentences: string[]) => sentences.join(' ').replace(/[,;:!?]|\.(?=\s|$)/g, '');

describe('Spanish phonemes', () => {
  // Expected values are eSpeak NG's output, which the Spanish voice was trained on.
  it.each([
    ['¡Hola!', 'ˈola'],
    ['buenos días', 'bwˈenos ðˈias'],
    ['gracias', 'ɡɾˈaθjas'],
    ['Me llamo Juan y quiero agua.', 'me ʎˈamo xwˈan i kjˈeɾo ˈaɣwa'],
    ['un beso', 'ˈum bˈeso'],
    ['tengo', 'tˈɛŋɡo'],
    ['el perro', 'el pˈero'],
    ['Enrique', 'enrˈike'],
    ['hoy', 'ˈoɪ'],
    ['muy', 'mˈuj'],
    ['luego', 'luˈeɣo'],
    ['ciudad', 'θjuðˈad'],
    ['chocolate', 'tʃˌokolˈate'],
    ['¡Felicidades!', 'fˌeliθiðˈaðes'],
    ['ciertamente', 'θjˈeɾtamˈente'],
  ])('%s → %s', (text, expected) => {
    expect(withoutPunctuation(phonemizeSpanish(text))).toBe(expected);
  });

  it('keeps clause punctuation and splits sentences the way Piper does', () => {
    expect(phonemizeSpanish('Hola, ¿cómo estás? Bien.')).toEqual(['ˈola, kˈomo estˈas?', 'bjˈen.']);
  });

  it('spells out numbers', () => {
    expect(spanishNumber(21)).toBe('veintiuno');
    expect(spanishNumber(1999)).toBe('mil novecientos noventa y nueve');
    expect(withoutPunctuation(phonemizeSpanish('3 cafés'))).toBe('tɾˈes kafˈes');
  });

  it('uses only symbols the Spanish voice knows for every course text', () => {
    for (const text of courseTexts('es')) {
      const sentences = phonemizeSpanish(text);
      expect(sentences.length, text).toBeGreaterThan(0);
      for (const sentence of sentences) expect(encodeEspeakPhonemes(sentence, { phoneme_id_map: voiceMap }).dropped, text).toEqual([]);
    }
  });
});

describe('Hindi phonemes', () => {
  // Expected values are eSpeak NG's output, which the Hindi voice was trained on.
  it.each([
    ['नमस्ते', 'nəmˈʌsteː'],
    ['धन्यवाद', 'dʰˌənjəʋˈaːd'],
    ['कमरा', 'kˈʌmɾaː'],
    ['मैं पानी पीता हूँ।', 'mɛ̃ pˈaːni pˈiːtaː hũ'],
    ['अलविदा', 'ˈʌlʋɪdaː'],
    ['लड़का', 'lˈʌr.kaː'],
    ['सुबह', 'sˈʊbəh'],
    ['ठंडा', 'ʈʰˈʌɳɖaː'],
    ['हैं', 'hɛ̃'],
    ['पाँच', 'pˈãnc'],
    ['अच्छा', 'ˈʌcʰcʰaː'],
    ['कुत्ता', 'kˈʊtːaː'],
    ['रहता', 'ɾˈʌhətaː'],
    ['परिवार', 'pˌəɾɪʋˈaːɾ'],
    ['क्षमा', 'kʃˈʌmaː'],
    ['क', 'kˈə'],
  ])('%s → %s', (text, expected) => {
    expect(withoutPunctuation(phonemizeHindi(text)).normalize('NFC')).toBe(expected.normalize('NFC'));
  });

  it('ends sentences at the danda and keeps clause punctuation', () => {
    expect(phonemizeHindi('हाँ, कृपया। धन्यवाद!')).toEqual(['hˈã, kɾˈɪpjaː.', 'dʰˌənjəʋˈaːd!']);
  });

  it('reads digits one by one', () => {
    expect(withoutPunctuation(phonemizeHindi('5'))).toBe(withoutPunctuation(phonemizeHindi('पाँच')));
  });

  it('uses only symbols the Hindi voice knows for every course text', () => {
    for (const text of courseTexts('hi')) {
      const sentences = phonemizeHindi(text);
      expect(sentences.length, text).toBeGreaterThan(0);
      for (const sentence of sentences) expect(encodeEspeakPhonemes(sentence, { phoneme_id_map: voiceMap }).dropped, text).toEqual([]);
    }
  });
});

describe('Piper phoneme ids', () => {
  it('wraps ids in ^ … $ with padding after every symbol, splitting combining marks', () => {
    const map = { _: [0], '^': [1], $: [2], h: [3], ĩ: [99], i: [4], '̃': [5] };
    expect(encodeEspeakPhonemes('hĩ', { phoneme_id_map: map })).toEqual({ ids: [1, 0, 3, 0, 4, 0, 5, 0, 2], dropped: [] });
  });

  it('merges the vowel clusters a voice was trained with', () => {
    const map = { _: [0], '^': [1], $: [2], a: [3], ɪ: [4], aɪ: [7] };
    expect(encodeEspeakPhonemes('aɪ', { phoneme_id_map: map, vowel_clusters: [['a', 'ɪ']] }).ids).toEqual([1, 0, 7, 0, 2]);
    expect(encodeEspeakPhonemes('aɪ', { phoneme_id_map: map }).ids).toEqual([1, 0, 3, 0, 4, 0, 2]);
  });

  it('reports symbols the voice has no id for', () => {
    expect(encodeEspeakPhonemes('aq', { phoneme_id_map: { _: [0], '^': [1], $: [2], a: [3] } }).dropped).toEqual(['q']);
  });
});

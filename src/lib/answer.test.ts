import { describe, expect, it } from 'vitest';
import { checkSpeech, checkText, expand, expandAll, normalize, toTiles } from './answer';

describe('expand', () => {
  it('expands alternatives and optional parts', () => {
    expect(expand("I( am|'m) a man.")).toEqual(['I am a man.', "I'm a man."]);
    expect(expand('Turn [to the ]right.')).toEqual(['Turn to the right.', 'Turn right.']);
    expect(expand('[Yo ]bebo agua.')).toEqual(['Yo bebo agua.', 'bebo agua.']);
  });
  it('dedupes across pattern lists', () => {
    expect(expandAll(['Hi.', '(Hi|Hello).'])).toEqual(['Hi.', 'Hello.']);
  });
  it('throws on an unclosed group', () => {
    expect(() => expand('I (am')).toThrow();
  });
});

describe('normalize', () => {
  it('ignores case, punctuation and inverted marks', () => {
    expect(normalize('¿Dónde está el hotel?', true)).toBe('dónde está el hotel');
    expect(normalize('¿Dónde está el hotel?')).toBe('donde esta el hotel');
  });
});

describe('checkText', () => {
  const accepted = expandAll("I( am|'m) (well|fine), (thank you|thanks).");
  it('accepts any expansion regardless of case/punctuation', () => {
    expect(checkText("i'm fine thanks", accepted, { typos: true }).correct).toBe(true);
    expect(checkText('I AM WELL, THANK YOU!', accepted, { typos: true })).toEqual({
      correct: true,
      answer: 'I am well, thank you.',
    });
  });
  it('accepts missing accents with a note', () => {
    const r = checkText('adios', ['adiós'], { typos: true });
    expect(r.correct).toBe(true);
    expect(r.note).toContain('adiós');
  });
  it('accepts a one-letter typo only when allowed', () => {
    expect(checkText('I am wel, thank you', accepted, { typos: true }).note).toMatch(/typo/i);
    expect(checkText('I am wel, thank you', accepted, { typos: false }).correct).toBe(false);
  });
  it('rejects wrong and empty answers', () => {
    expect(checkText('I am bad', accepted, { typos: true }).correct).toBe(false);
    expect(checkText('   ', accepted, { typos: true }).correct).toBe(false);
  });
});

describe('toTiles', () => {
  it('splits words, strips punctuation, keeps I capitalised', () => {
    expect(toTiles('Hola, gracias.')).toEqual(['hola', 'gracias']);
    expect(toTiles("I'm called Ana.")).toEqual(["I'm", 'called', 'Ana']);
  });
});

describe('checkSpeech', () => {
  it('ignores accents and punctuation the recogniser adds or drops', () => {
    expect(checkSpeech('donde esta el hotel', ['¿Dónde está el hotel?']).correct).toBe(true);
    expect(checkSpeech('Gracias.', ['gracias']).note).toBeUndefined();
  });
  it('allows a near miss in proportion to length', () => {
    expect(checkSpeech('quiero un cafe por fabor', ['Quiero un café, por favor.']).correct).toBe(true);
    expect(checkSpeech('no', ['sí']).correct).toBe(false);
    expect(checkSpeech('pan', ['pez']).correct).toBe(false);
  });
  it('says what it heard when the answer is wrong', () => {
    const r = checkSpeech('buenas noches', ['Buenos días']);
    expect(r.correct).toBe(false);
    expect(r.note).toContain('buenas noches');
  });
  it('rejects silence', () => {
    expect(checkSpeech('  ', ['hola']).correct).toBe(false);
  });
});

describe('Japanese answers', () => {
  it('ignores the spaces that course sentences add between words', () => {
    expect(checkText('水 を 飲みます', ['水 を 飲みます。'], { typos: false }).correct).toBe(true);
    expect(checkSpeech('水を飲みます', ['水 を 飲みます。']).correct).toBe(true);
    expect(checkSpeech('お茶を飲みます', ['水 を 飲みます。']).correct).toBe(false);
  });
  it('keeps voiced kana distinct', () => {
    expect(normalize('が')).toBe('が');
    expect(checkText('か', ['が'], { typos: false }).correct).toBe(false);
  });
  it('splits sentences into word tiles without Japanese punctuation', () => {
    expect(toTiles('はい、 おねがいします。')).toEqual(['はい', 'おねがいします']);
  });
});

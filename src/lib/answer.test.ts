import { describe, expect, it } from 'vitest';
import { checkText, expand, expandAll, normalize, toTiles } from './answer';

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

import type { CheckResult, Pattern } from '../types';

/** Expand a pattern with `(a|b)` alternatives and `[optional]` parts (not nested). */
export function expand(pattern: string, limit = 500): string[] {
  let results = [''];
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === '(' || ch === '[') {
      const close = pattern.indexOf(ch === '(' ? ')' : ']', i);
      if (close === -1) throw new Error(`Unclosed group in pattern: ${pattern}`);
      const inner = pattern.slice(i + 1, close);
      const options = ch === '(' ? inner.split('|') : [inner, ''];
      const next: string[] = [];
      for (const r of results) for (const o of options) if (next.length < limit) next.push(r + o);
      results = next;
      i = close + 1;
    } else {
      let j = i;
      while (j < pattern.length && pattern[j] !== '(' && pattern[j] !== '[') j++;
      const literal = pattern.slice(i, j);
      results = results.map((r) => r + literal);
      i = j;
    }
  }
  return results.map((r) =>
    r
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.?!])/g, '$1')
      .trim(),
  );
}

export function expandAll(p: Pattern): string[] {
  const list = Array.isArray(p) ? p : [p];
  return [...new Set(list.flatMap((x) => expand(x)))];
}

/** The display form of a pattern (its first expansion). */
export function primary(p: Pattern): string {
  return expandAll(p)[0];
}

export function normalize(s: string, keepAccents = false): string {
  let t = s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/œ/g, 'oe')
    .replace(/[¿¡?!.,;:"«»…\-–—।]/g, ' ');
  if (!keepAccents) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return t.replace(/\s+/g, ' ').trim();
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/**
 * Compare a learner's answer to the accepted answers.
 * Exact (ignoring case/punctuation) → correct. Missing accents → correct with a note.
 * One-letter typo on longer answers → correct with a note (when allowed).
 */
export function checkText(input: string, accepted: string[], opts: { typos: boolean }): CheckResult {
  const answer = accepted[0];
  const strict = normalize(input, true);
  if (!strict) return { correct: false, answer };
  if (accepted.some((a) => normalize(a, true) === strict)) return { correct: true, answer };

  const loose = normalize(input);
  const accentMatch = accepted.find((a) => normalize(a) === loose);
  if (accentMatch) return { correct: true, answer, note: `Watch the accents: “${accentMatch}”` };

  if (opts.typos && loose.length >= 4) {
    const typoMatch = accepted.find((a) => levenshtein(normalize(a), loose) <= 1);
    if (typoMatch) return { correct: true, answer, note: `Small typo. It's “${typoMatch}”` };
  }
  return { correct: false, answer };
}

/** Split a sentence into word tiles. The first word is lower-cased unless it's "I". */
export function toTiles(sentence: string): string[] {
  const words = sentence.replace(/[¿¡?!.,;:"।]/g, '').split(/\s+/).filter(Boolean);
  return words.map((w, i) => (i === 0 && !/^I($|')/.test(w) ? w.toLowerCase() : w));
}

/** Romanize a sentence word by word; undefined if any word is missing from the glossary. */
export function romanize(text: string, glossary: Record<string, string> | undefined): string | undefined {
  if (!glossary) return undefined;
  const parts = toTiles(text).map((w) => glossary[w]);
  return parts.every(Boolean) ? parts.join(' ') : undefined;
}

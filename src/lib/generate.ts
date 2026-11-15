import { lessonsOf, unitOf } from '../data/courses';
import type { Course, Exercise, Lesson, Sentence, Side, Word } from '../types';
import { expandAll, normalize, primary, romanize, toTiles } from './answer';

export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const sample = <T,>(items: T[], n: number): T[] => shuffle(items).slice(0, n);

export type GenerateOptions = { speech: boolean };

/** Shared context for building one session's exercises. */
type Ctx = {
  course: Course;
  speech: boolean;
  /** True when the words are script letters (sounds), not vocabulary. */
  script: boolean;
  /** Fallback distractor pool of the same kind (letters or words). */
  fallback: Word[];
};

const wordsOfKind = (course: Course, script: boolean) =>
  lessonsOf(course)
    .filter((l) => (l.kind === 'script') === script)
    .flatMap((l) => l.words);

function distractors(word: Word, pool: Word[], ctx: Ctx, n = 3): Word[] {
  const chosen: Word[] = [];
  for (const w of [...shuffle(pool), ...shuffle(ctx.fallback)]) {
    if (chosen.length >= n) break;
    const clash = (x: Word) => x.t === w.t || x.en === w.en;
    if (!clash(word) && !chosen.some(clash)) chosen.push(w);
  }
  return chosen;
}

const roman = (ctx: Ctx, text: string) => (ctx.script ? undefined : romanize(text, ctx.course.glossary));

function meaningChoice(key: string, word: Word, pool: Word[], ctx: Ctx): Exercise {
  const options = shuffle([word, ...distractors(word, pool, ctx)]).map((w) => ({
    label: w.t,
    emoji: w.emoji,
    roman: roman(ctx, w.t),
    speak: w.t,
  }));
  return {
    kind: 'choice',
    key,
    instruction: ctx.script ? `Which letter makes the sound “${word.en}”?` : `Which one means “${word.en}”?`,
    optionSide: 't',
    options,
    answer: word.t,
  };
}

function soundChoice(key: string, word: Word, pool: Word[], ctx: Ctx): Exercise {
  const options = shuffle([word, ...distractors(word, pool, ctx)]).map((w) => ({ label: w.en }));
  return {
    kind: 'choice',
    key,
    instruction: 'What sound does this letter make?',
    prompt: word.t,
    optionSide: 'en',
    options,
    answer: word.en,
  };
}

function listenChoice(key: string, word: Word, pool: Word[], ctx: Ctx): Exercise {
  const options = shuffle([word, ...distractors(word, pool, ctx)]).map((w) => ({
    label: w.t,
    roman: roman(ctx, w.t),
  }));
  return { kind: 'choice', key, instruction: 'Tap what you hear', audio: word.t, optionSide: 't', options, answer: word.t };
}

function match(key: string, words: Word[], ctx: Ctx): Exercise {
  const pairs = sample(words, Math.min(5, words.length)).map((w) => ({ t: w.t, en: w.en, roman: roman(ctx, w.t) }));
  return {
    kind: 'match',
    key,
    instruction: ctx.script ? 'Match the letters to their sounds' : 'Match the pairs',
    pairs,
  };
}

function tileRomans(tiles: string[], ctx: Ctx): Record<string, string> | undefined {
  const g = ctx.course.glossary;
  if (!g) return undefined;
  return Object.fromEntries(tiles.filter((t) => g[t]).map((t) => [t, g[t]]));
}

function withDistractors(answerTiles: string[], pool: Sentence[], side: Side, n = 3): string[] {
  const used = new Set(answerTiles.map((t) => normalize(t)));
  const candidates = new Map<string, string>();
  for (const s of pool) {
    for (const t of toTiles(primary(s[side]))) {
      const nt = normalize(t);
      if (!used.has(nt) && !candidates.has(nt)) candidates.set(nt, t);
    }
  }
  return shuffle([...answerTiles, ...sample([...candidates.values()], n)]);
}

type SentenceKind = 'tiles-t-en' | 'tiles-en-t' | 'type-t-en' | 'type-en-t' | 'listen';

function sentenceExercise(key: string, s: Sentence, kind: SentenceKind, pool: Sentence[], ctx: Ctx): Exercise {
  const others = pool.filter((p) => p !== s);
  if (kind === 'listen') {
    const accepted = expandAll(s.t);
    const tiles = withDistractors(toTiles(accepted[0]), others, 't');
    return {
      kind: 'tiles',
      key,
      instruction: 'Tap what you hear',
      audio: accepted[0],
      answerSide: 't',
      tiles,
      roman: tileRomans(tiles, ctx),
      accepted,
    };
  }
  const [mode, from, to] = kind.split('-') as ['tiles' | 'type', Side, Side];
  const accepted = expandAll(s[to]);
  const prompt = primary(s[from]);
  const promptRoman = from === 't' ? roman(ctx, prompt) : undefined;
  if (mode === 'tiles') {
    const tiles = withDistractors(toTiles(accepted[0]), others, to);
    return {
      kind: 'tiles',
      key,
      instruction: 'Translate this sentence',
      prompt,
      promptRoman,
      promptSide: from,
      answerSide: to,
      tiles,
      roman: to === 't' ? tileRomans(tiles, ctx) : undefined,
      accepted,
    };
  }
  return {
    kind: 'type',
    key,
    instruction: to === 'en' ? 'Write this in English' : `Write this in ${ctx.course.name}`,
    prompt,
    promptRoman,
    promptSide: from,
    answerSide: to,
    accepted,
  };
}

function sentenceKinds(ctx: Ctx): SentenceKind[] {
  const toTarget: SentenceKind = ctx.course.typeInTarget ? 'type-en-t' : 'tiles-en-t';
  return ['tiles-t-en', 'tiles-en-t', ctx.speech ? 'listen' : toTarget, 'type-t-en'];
}

/** Build a lesson: introduce words (or letters), match them, then practise sentences (or sounds). */
export function generateLesson(course: Course, lesson: Lesson, opts: GenerateOptions): Exercise[] {
  const unit = unitOf(course, lesson.id);
  const script = lesson.kind === 'script';
  const ctx: Ctx = { course, speech: opts.speech, script, fallback: wordsOfKind(course, script) };
  // Script lessons only quiz letters taught in this lesson; vocabulary draws distractors from the unit.
  const wordPool = script ? lesson.words : unit.lessons.filter((l) => l.kind !== 'script').flatMap((l) => l.words);
  let n = 0;
  const key = () => `${lesson.id}-${n++}`;

  const intro = shuffle(lesson.words).map((w, i) =>
    opts.speech && i % 3 === 2 ? listenChoice(key(), w, wordPool, ctx) : meaningChoice(key(), w, wordPool, ctx),
  );
  const head = [...intro.slice(0, 3), match(key(), lesson.words, ctx), ...intro.slice(3)];

  if (script) {
    return [...head, ...sample(lesson.words, 4).map((w) => soundChoice(key(), w, wordPool, ctx))];
  }
  const sentencePool = unit.lessons.flatMap((l) => l.sentences);
  const kinds = sentenceKinds(ctx);
  const sentences = shuffle(lesson.sentences).map((s, i) =>
    sentenceExercise(key(), s, kinds[i % kinds.length], sentencePool, ctx),
  );
  return [...head, ...sentences];
}

/** A mixed review over the given lessons of one course. */
export function generatePractice(course: Course, lessons: Lesson[], opts: GenerateOptions): Exercise[] {
  const vocab = lessons.filter((l) => l.kind !== 'script');
  const script = vocab.length === 0;
  const source = script ? lessons : vocab;
  const ctx: Ctx = { course, speech: opts.speech, script, fallback: wordsOfKind(course, script) };
  const words = sample(
    source.flatMap((l) => l.words),
    6,
  );
  let n = 0;
  const key = () => `practice-${n++}`;
  const head = [
    meaningChoice(key(), words[0], words, ctx),
    opts.speech ? listenChoice(key(), words[1], words, ctx) : meaningChoice(key(), words[1], words, ctx),
    match(key(), words, ctx),
  ];

  if (script) return [...head, ...words.slice(2, 6).map((w) => soundChoice(key(), w, words, ctx))];

  const sentencePool = source.flatMap((l) => l.sentences);
  const pool = sentencePool.length >= 4 ? sentencePool : lessonsOf(course).flatMap((l) => l.sentences);
  const kinds = shuffle([...sentenceKinds(ctx), 'tiles-en-t' as SentenceKind]);
  return [
    ...head,
    ...sample(sentencePool, 5).map((s, i) => sentenceExercise(key(), s, kinds[i % kinds.length], pool, ctx)),
  ];
}

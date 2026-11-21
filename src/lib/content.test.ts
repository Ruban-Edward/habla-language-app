import { describe, expect, it } from 'vitest';
import {
  COURSES,
  findMission,
  getCourse,
  missionsFor,
  isLevelComplete,
  isLevelUnlocked,
  isUnlocked,
  LEARNING_LEVELS,
  lessonsOf,
  unitsInLevel,
} from '../data/courses';
import { checkText, expandAll, normalize, primary, toTiles } from './answer';
import { checkExercise } from './check';
import { generateLesson, generatePractice, generateReview } from './generate';

describe('courses', () => {
  it('offers Spanish, French, Hindi, German and Japanese', () => {
    expect(COURSES.map((c) => c.id)).toEqual(['es', 'fr', 'hi', 'de', 'ja']);
  });

  it('has unique, course-prefixed lesson ids', () => {
    const ids = COURSES.flatMap((c) => lessonsOf(c).map((l) => l.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of COURSES) for (const l of lessonsOf(c)) expect(l.id.startsWith(`${c.id}-`)).toBe(true);
  });

  it('offers matching beginner, intermediate and advanced paths in all three languages', () => {
    const frenchShape = LEARNING_LEVELS.map((level) => {
      const units = unitsInLevel(getCourse('fr'), level);
      return [units.length, units.reduce((count, unit) => count + unit.lessons.length, 0)];
    });

    for (const course of COURSES) {
      const shape = LEARNING_LEVELS.map((level) => {
        const units = unitsInLevel(course, level);
        return [units.length, units.reduce((count, unit) => count + unit.lessons.length, 0)];
      });
      expect(shape, course.name).toEqual(frenchShape);
    }
  });

  for (const course of COURSES) {
    describe(course.name, () => {
      it('has no duplicate words or meanings within a unit (keeps choices unambiguous)', () => {
        for (const unit of course.units) {
          const words = unit.lessons.flatMap((l) => l.words);
          expect(new Set(words.map((w) => w.t)).size, unit.id).toBe(words.length);
          expect(new Set(words.map((w) => w.en)).size, unit.id).toBe(words.length);
        }
      });

      it('has usage notes for every unit', () => {
        for (const unit of course.units) {
          expect(unit.notes?.length ?? 0, unit.id).toBeGreaterThan(0);
          for (const note of unit.notes ?? []) {
            expect(note.title.trim(), unit.id).not.toBe('');
            expect(note.body.trim(), unit.id).not.toBe('');
            if (course.glossary) for (const example of note.examples ?? []) expect(example.roman, example.t).toBeTruthy();
          }
        }
      });

      it('keeps listening exercises when speaking is on, and adds a spoken sentence', () => {
        const lesson = lessonsOf(course).find((l) => l.kind !== 'script' && l.words.length >= 6 && l.sentences.length)!;
        const both = generateLesson(course, lesson, { speech: true, recognition: true });
        expect(both.some((e) => e.kind === 'choice' && e.audio)).toBe(true);
        expect(both.some((e) => e.kind === 'speak' && e.instruction === 'Say this word')).toBe(true);
        expect(both.some((e) => e.kind === 'speak' && e.instruction === 'Say this sentence')).toBe(true);
      });

      it('has well-formed mini-stories', () => {
        const stories = course.stories ?? [];
        expect(stories.length).toBeGreaterThanOrEqual(2);
        expect(new Set(stories.map((s) => s.id)).size).toBe(stories.length);
        for (const story of stories) {
          expect(course.units.some((u) => u.id === story.afterUnit), `${story.id} afterUnit`).toBe(true);
          expect(story.lines, story.id).toHaveLength(5);
          for (const line of story.lines) {
            expect(line.en.trim(), line.t).not.toBe('');
            if (course.glossary) expect(line.roman, line.t).toBeTruthy();
          }
          expect(story.questions.length, story.id).toBeGreaterThanOrEqual(3);
          for (const q of story.questions) {
            expect(new Set(q.options).size, q.question).toBe(q.options.length);
            expect(q.options, q.question).toContain(q.answer);
          }
        }
      });

      it('has culture notes', () => {
        const notes = course.culture ?? [];
        expect(notes.length).toBeGreaterThanOrEqual(5);
        expect(new Set(notes.map((n) => n.id)).size).toBe(notes.length);
        for (const note of notes) {
          expect(note.body.trim(), note.id).not.toBe('');
          if (course.glossary && note.phrase) expect(note.phrase.roman, note.id).toBeTruthy();
        }
      });

      it('has well-formed real-life missions', () => {
        const missions = course.missions ?? [];
        expect(missions.length).toBeGreaterThanOrEqual(9);
        expect(new Set(missions.map((m) => m.id)).size).toBe(missions.length);
        for (const mission of missions) {
          expect(mission.id.startsWith(`${course.id}-`)).toBe(true);
          expect(course.units.some((u) => u.id === mission.afterUnit), `${mission.id} afterUnit`).toBe(true);
          expect(mission.reasons.length, mission.id).toBeGreaterThan(0);
          expect(mission.turns.length, mission.id).toBeGreaterThanOrEqual(3);
          for (const turn of mission.turns) {
            const lines = [turn.partner, ...turn.replies];
            expect(turn.replies.some((r) => r.correct), `${mission.id}: ${turn.goal}`).toBe(true);
            expect(turn.replies.some((r) => !r.correct), `${mission.id}: ${turn.goal}`).toBe(true);
            expect(new Set(turn.replies.map((r) => normalize(r.t))).size, turn.goal).toBe(turn.replies.length);
            for (const reply of turn.replies) expect(reply.feedback.trim(), reply.t).not.toBe('');
            for (const line of lines) {
              expect(line.en.trim(), line.t).not.toBe('');
              if (course.glossary) expect(line.roman, line.t).toBeTruthy();
            }
          }
        }
      });

      it('every sentence pattern expands', () => {
        for (const l of lessonsOf(course))
          for (const s of l.sentences) {
            expect(expandAll(s.t).length).toBeGreaterThan(0);
            expect(expandAll(s.en).length).toBeGreaterThan(0);
          }
      });

      it('unlocks lessons in order', () => {
        const [a, b] = lessonsOf(course);
        expect(isUnlocked(course, a.id, {})).toBe(true);
        expect(isUnlocked(course, b.id, {})).toBe(false);
        expect(isUnlocked(course, b.id, { [a.id]: {} })).toBe(true);
      });

      it('generates short review questions tied to the vocabulary being reviewed', () => {
        const lesson = lessonsOf(course).find((item) => item.kind !== 'script')!;
        const word = lesson.words[0];
        const review = generateReview(course, [word], { speech: false });
        expect(review).toHaveLength(1);
        expect(review[0].reviewIds).toEqual([word.t]);
        expect(review[0].kind).toBe('choice');
        expect(checkExercise(review[0], word.t).correct).toBe(true);
      });

      for (const [speech, recognition] of [[true, true], [true, false], [false, true], [false, false]]) {
        it(`every generated exercise is solvable (speech=${speech}, recognition=${recognition})`, () => {
          for (let round = 0; round < 5; round++) {
            for (const lesson of lessonsOf(course)) {
              const exercises = [
                ...generateLesson(course, lesson, { speech, recognition }),
                ...generatePractice(course, [lesson], { speech, recognition }),
              ];
              expect(new Set(exercises.map((e) => e.key)).size).toBe(exercises.length);
              for (const ex of exercises) {
                if (ex.kind === 'choice') {
                  expect(ex.options).toHaveLength(4);
                  expect(new Set(ex.options.map((o) => o.label)).size).toBe(4);
                  expect(ex.options.some((o) => o.label === ex.answer)).toBe(true);
                  expect(checkExercise(ex, ex.answer).correct).toBe(true);
                }
                if (ex.kind === 'tiles') {
                  const needed = toTiles(ex.accepted[0]);
                  const bank = [...ex.tiles];
                  for (const t of needed) {
                    const i = bank.indexOf(t);
                    expect(i, `${lesson.id}: tile "${t}" missing`).toBeGreaterThanOrEqual(0);
                    bank.splice(i, 1);
                  }
                  expect(checkExercise(ex, needed.join(' ')).correct, `${lesson.id}: ${ex.accepted[0]}`).toBe(true);
                  const answerWords = new Set(needed.map((t) => normalize(t)));
                  expect(bank.every((t) => !answerWords.has(normalize(t)))).toBe(true);
                }
                if (ex.kind === 'type') {
                  expect(checkText(ex.accepted[0], ex.accepted, { typos: true }).correct).toBe(true);
                  if (!course.typeInTarget) expect(ex.answerSide).toBe('en');
                }
                if (ex.kind === 'match') expect(ex.pairs.length).toBeGreaterThanOrEqual(4);
                if (ex.kind === 'speak') {
                  expect(lesson.kind, `${lesson.id}: letters are never spoken alone`).not.toBe('script');
                  for (const said of ex.accepted) expect(checkExercise(ex, said).correct, said).toBe(true);
                }
                if (!speech) expect('audio' in ex && ex.audio).toBeFalsy();
                if (!recognition) expect(ex.kind).not.toBe('speak');
              }
            }
          }
        });
      }
    });
  }
});

describe('missions', () => {
  it('suggests missions that fit the learner’s reason first', () => {
    const spanish = getCourse('es');
    expect(missionsFor(spanish, 'work')[0].reasons).toContain('work');
    expect(missionsFor(spanish, 'travel')[0].reasons).toContain('travel');
    expect(missionsFor(spanish, null).map((m) => m.id)).toHaveLength(spanish.missions!.length);
    expect(findMission(spanish, 'es-cafe')?.title).toBe('Order at a café');
  });

  it('accepts a typed reply that matches a natural answer', () => {
    const turn = findMission(getCourse('fr'), 'fr-cafe')!.turns[0];
    const accepted = turn.replies.filter((r) => r.correct).map((r) => r.t);
    expect(checkText("bonjour, un cafe, s'il vous plait", accepted, { typos: true }).correct).toBe(true);
    expect(checkText('un café', accepted, { typos: true }).correct).toBe(false);
  });
});

for (const id of ['hi', 'ja']) describe(`${getCourse(id).name} script and romanization`, () => {
  const hindi = getCourse(id);
  const glossary = hindi.glossary!;

  it('starts with the script unit', () => {
    expect(hindi.units[0].lessons.every((l) => l.kind === 'script')).toBe(true);
  });

  it('romanizes every word and every word shown in a sentence', () => {
    const missing = new Set<string>();
    for (const l of lessonsOf(hindi)) {
      if (l.kind !== 'script') for (const w of l.words) if (!glossary[w.t]) missing.add(w.t);
      for (const s of l.sentences)
        for (const variant of expandAll(s.t)) for (const tok of toTiles(variant)) if (!glossary[tok]) missing.add(tok);
    }
    expect([...missing]).toEqual([]);
  });

  it('shows romanization on prompts and tiles, but never gives away script answers', () => {
    for (const lesson of lessonsOf(hindi)) {
      for (const ex of generateLesson(hindi, lesson, { speech: true })) {
        if (lesson.kind === 'script') {
          if (ex.kind === 'choice') expect(ex.options.every((o) => !o.roman)).toBe(true);
          if (ex.kind === 'match') expect(ex.pairs.every((p) => !p.roman)).toBe(true);
          continue;
        }
        if (ex.kind === 'tiles' && ex.answerSide === 't') {
          for (const t of ex.tiles) expect(ex.roman?.[t], t).toBeTruthy();
          expect(checkExercise(ex, 'wrong').answerRoman).toBeTruthy();
        }
        if ((ex.kind === 'tiles' || ex.kind === 'type') && ex.promptSide === 't') {
          expect(ex.promptRoman).toBeTruthy();
        }
        if (ex.kind === 'choice' && ex.optionSide === 't') expect(ex.options.every((o) => o.roman)).toBe(true);
      }
    }
  });
});

describe('Hindi', () => {
  const hindi = getCourse('hi');

  it('handles the danda and accepts either gendered verb form', () => {
    const s = lessonsOf(hindi)
      .flatMap((l) => l.sentences)
      .find((x) => primary(x.t) === 'मैं रोटी खाता हूँ।')!;
    const accepted = expandAll(s.t);
    expect(checkText('मैं रोटी खाती हूँ', accepted, { typos: false }).correct).toBe(true);
  });
});

describe('French', () => {
  const french = getCourse('fr');

  it('unlocks intermediate after beginner and advanced after intermediate', () => {
    const completedFor = (level: 'beginner' | 'intermediate') =>
      Object.fromEntries(unitsInLevel(french, level).flatMap((unit) => unit.lessons.map((lesson) => [lesson.id, {}])));
    const beginnerDone = completedFor('beginner');
    const intermediateDone = completedFor('intermediate');
    const firstIntermediate = unitsInLevel(french, 'intermediate')[0].lessons[0];
    const firstAdvanced = unitsInLevel(french, 'advanced')[0].lessons[0];

    expect(isLevelUnlocked(french, 'intermediate', {})).toBe(false);
    expect(isLevelUnlocked(french, 'advanced', {})).toBe(false);
    expect(isLevelComplete(french, 'beginner', beginnerDone)).toBe(true);
    expect(isUnlocked(french, firstIntermediate.id, beginnerDone)).toBe(true);
    expect(isLevelUnlocked(french, 'advanced', beginnerDone)).toBe(false);
    expect(isUnlocked(french, firstAdvanced.id, beginnerDone)).toBe(false);
    expect(isLevelUnlocked(french, 'advanced', { ...beginnerDone, ...intermediateDone })).toBe(true);
  });

  it("accepts 'oe' for 'œ' and keeps elisions as single tiles", () => {
    expect(checkText('je mange un oeuf', ['Je mange un œuf.'], { typos: true }).correct).toBe(true);
    expect(toTiles("Je voudrais un thé, s'il vous plaît.")).toEqual([
      'je',
      'voudrais',
      'un',
      'thé',
      "s'il",
      'vous',
      'plaît',
    ]);
  });
});

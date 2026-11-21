import { describe, expect, it } from 'vitest';
import { mergeProgress, sameProgress } from './merge';
import {
  initialProgress,
  recordMission,
  recordSession,
  recordWordReview,
  toggleSavedPhrase,
  type Progress,
} from './progress';

const DAY = 24 * 60 * 60 * 1000;
const day = (n: number) => new Date(2025, 0, n, 12).getTime();
const lesson = (p: Progress, lessonId: string, t: number, accuracy = 100) =>
  recordSession(p, { courseId: 'es', lessonId, xp: 10, accuracy }, t);

describe('mergeProgress', () => {
  const base = lesson({ ...initialProgress(day(1)), course: 'es' }, 'es-u1l1', day(1));

  it('adds up XP and lesson attempts earned on both devices since the last sync', () => {
    const phone = lesson(base, 'es-u1l2', day(2));
    const laptop = lesson(lesson(base, 'es-u1l1', day(2), 60), 'es-u1l3', day(2));
    const merged = mergeProgress(phone, laptop, base);
    expect(merged.xp).toBe(base.xp + 10 + 20);
    expect(merged.courseXp.es).toBe(base.courseXp.es + 30);
    expect(merged.dailyXp['2025-01-02']).toBe(30);
    expect(merged.completed['es-u1l1']).toEqual({ times: 2, bestAccuracy: 100 });
    expect(Object.keys(merged.completed).sort()).toEqual(['es-u1l1', 'es-u1l2', 'es-u1l3']);
  });

  it('never double counts without a shared base', () => {
    const merged = mergeProgress(base, lesson(base, 'es-u1l2', day(2)), null);
    expect(merged.xp).toBe(base.xp + 10);
    expect(merged.completed['es-u1l1'].times).toBe(1);
  });

  it('is unchanged when merging a copy with itself', () => {
    expect(sameProgress(mergeProgress(base, base, base), base)).toBe(true);
    expect(sameProgress(mergeProgress(base, base, null), base)).toBe(true);
  });

  it('keeps the most recent review of each word and adds up week-later recall', () => {
    const seen = recordWordReview(base, 'es', ['hola', 'gracias'], true, day(1));
    const phone = recordWordReview(seen, 'es', ['hola'], false, day(9));
    const laptop = recordWordReview(seen, 'es', ['gracias', 'hola'], true, day(10));
    const merged = mergeProgress(phone, laptop, seen);
    expect(merged.wordReviews['es:hola']).toEqual(laptop.wordReviews['es:hola']);
    expect(merged.wordReviews['es:gracias']).toEqual(laptop.wordReviews['es:gracias']);
    expect(merged.recall.es).toEqual({ attempts: 3, correct: 2 });
  });

  it('keeps phrases saved on either device and respects removals', () => {
    const shared = toggleSavedPhrase(base, { courseId: 'es', target: 'hola', meaning: 'hello' }, day(1));
    const phone = toggleSavedPhrase(
      toggleSavedPhrase(shared, { courseId: 'es', target: 'hola', meaning: 'hello' }, day(2)),
      { courseId: 'es', target: 'adiós', meaning: 'goodbye' },
      day(2),
    );
    const laptop = toggleSavedPhrase(shared, { courseId: 'es', target: 'gracias', meaning: 'thanks' }, day(3));
    expect(mergeProgress(phone, laptop, shared).savedPhrases.map((p) => p.target)).toEqual(['adiós', 'gracias']);
    // Without a base nothing can be known to be removed, so nothing is lost.
    expect(mergeProgress(phone, laptop, null).savedPhrases.map((p) => p.target)).toEqual(['hola', 'adiós', 'gracias']);
  });

  it('takes settings from the device that changed them', () => {
    const phone = { ...base, dailyGoal: 50 };
    const laptop = { ...base, showRoman: false, learningReason: 'travel' as const };
    const merged = mergeProgress(phone, laptop, base);
    expect(merged).toMatchObject({ dailyGoal: 50, showRoman: false, learningReason: 'travel' });
    expect(mergeProgress({ ...base, course: 'fr' }, { ...base, course: null }, null).course).toBe('fr');
  });

  it('keeps dashboard history from both devices without duplicates', () => {
    const phone = lesson(base, 'es-u1l2', day(2));
    const laptop = lesson(base, 'es-u1l3', day(3), 80);
    const merged = mergeProgress(phone, laptop, base);
    expect(merged.sessionHistory.map((s) => s.date)).toEqual(['2025-01-01', '2025-01-02', '2025-01-03']);
    expect(mergeProgress(merged, merged, merged).sessionHistory).toHaveLength(3);
  });

    it('merges missions like lessons', () => {
    const phone = recordMission(base, 'es-cafe', 75);
    const laptop = recordMission(base, 'es-cafe', 100);
    expect(mergeProgress(phone, laptop, base).missions['es-cafe']).toEqual({ times: 2, bestAccuracy: 100 });
  });

  it('continues the streak across days practised on different devices', () => {
    const start = lesson(base, 'es-u1l2', day(2)); // streak 2 (days 1–2)
    const phone = lesson(start, 'es-u1l3', day(3)); // day 3 on the phone
    const laptop = lesson(start, 'es-u2l1', day(4)); // day 4 on the laptop, which never saw day 3
    expect(laptop.streak).toBe(1);
    const merged = mergeProgress(phone, laptop, start);
    expect(merged.lastActiveDate).toBe('2025-01-04');
    expect(merged.streak).toBe(4);
  });

  it('uses the hearts state that changed most recently', () => {
    const phone = { ...base, hearts: 3, heartsUpdatedAt: day(2) };
    const laptop = { ...base, hearts: 5, heartsUpdatedAt: day(2) - DAY };
    expect(mergeProgress(phone, laptop, base)).toMatchObject({ hearts: 3, heartsUpdatedAt: day(2) });
  });

  it('lets a reset win over older progress from another device', () => {
    const reset = { ...initialProgress(day(5)), course: 'es', resetAt: day(5) };
    const other = lesson(base, 'es-u1l2', day(4));
    expect(sameProgress(mergeProgress(reset, other, base), reset)).toBe(true);
    expect(sameProgress(mergeProgress(other, reset, base), reset)).toBe(true);
    // After both sides have the reset, new progress merges normally.
    const after = lesson(reset, 'es-u1l1', day(6));
    expect(mergeProgress(after, reset, reset).xp).toBe(10);
  });
});

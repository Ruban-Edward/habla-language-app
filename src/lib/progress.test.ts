import { describe, expect, it } from 'vitest';
import {
  HEART_REFILL_MS,
  MAX_HEARTS,
  currentStreak,
  gainHeart,
  initialProgress,
  loseHeart,
  migrate,
  msUntilNextHeart,
  recordSession,
  regenHearts,
  xpFor,
} from './progress';

const day = (d: number, h = 12) => new Date(2026, 10, d, h).getTime();

describe('streaks', () => {
  it('starts at 1, holds within a day, grows on consecutive days', () => {
    let p = recordSession(initialProgress(day(1)), { courseId: 'es', xp: 10, accuracy: 100 }, day(1, 9));
    expect(p.streak).toBe(1);
    p = recordSession(p, { courseId: 'es', xp: 10, accuracy: 100 }, day(1, 20));
    expect(p.streak).toBe(1);
    expect(p.dailyXp['2026-11-01']).toBe(20);
    p = recordSession(p, { courseId: 'es', xp: 10, accuracy: 100 }, day(2));
    expect(p.streak).toBe(2);
  });

  it('survives the next day but resets after a missed day', () => {
    const p = recordSession(initialProgress(day(1)), { courseId: 'es', xp: 10, accuracy: 100 }, day(1));
    expect(currentStreak(p, day(2, 23))).toBe(1);
    expect(currentStreak(p, day(3))).toBe(0);
    expect(recordSession(p, { courseId: 'es', xp: 10, accuracy: 100 }, day(4)).streak).toBe(1);
  });

  it('records lesson completion with best accuracy', () => {
    let p = recordSession(initialProgress(0), { courseId: 'es', lessonId: 'es-u1l1', xp: 10, accuracy: 80 }, day(1));
    p = recordSession(p, { courseId: 'es', lessonId: 'es-u1l1', xp: 10, accuracy: 70 }, day(1));
    expect(p.completed['es-u1l1']).toEqual({ times: 2, bestAccuracy: 80 });
  });
});

describe('hearts', () => {
  it('loses hearts and refills one per interval', () => {
    const t0 = 1_000_000;
    let p = loseHeart(loseHeart(initialProgress(t0), t0), t0);
    expect(p.hearts).toBe(MAX_HEARTS - 2);
    expect(msUntilNextHeart(p, t0)).toBe(HEART_REFILL_MS);
    expect(regenHearts(p, t0 + HEART_REFILL_MS - 1)).toBe(p);
    p = regenHearts(p, t0 + HEART_REFILL_MS + 5);
    expect(p.hearts).toBe(MAX_HEARTS - 1);
    expect(msUntilNextHeart(p, t0 + HEART_REFILL_MS + 5)).toBe(HEART_REFILL_MS - 5);
    p = regenHearts(p, t0 + 10 * HEART_REFILL_MS);
    expect(p.hearts).toBe(MAX_HEARTS);
    expect(msUntilNextHeart(p, 0)).toBeNull();
  });

  it('never goes below zero or above max', () => {
    let p = initialProgress(0);
    for (let i = 0; i < 10; i++) p = loseHeart(p, 0);
    expect(p.hearts).toBe(0);
    expect(gainHeart(initialProgress(0), 0).hearts).toBe(MAX_HEARTS);
  });
});

describe('xp', () => {
  it('rewards perfect lessons', () => {
    expect(xpFor({ practice: false, mistakes: 0 })).toBe(15);
    expect(xpFor({ practice: false, mistakes: 2 })).toBe(10);
    expect(xpFor({ practice: true, mistakes: 0 })).toBe(5);
  });
});

describe('migration from the Spanish-only version', () => {
  it('prefixes old lesson ids and selects Spanish', () => {
    const old = { ...initialProgress(0), xp: 40, completed: { u1l1: { times: 1, bestAccuracy: 90 } } } as Record<
      string,
      unknown
    >;
    delete old.course;
    delete old.courseXp;
    const raw = JSON.stringify(old);
    const p = migrate({ ...initialProgress(0), ...JSON.parse(raw) }, raw);
    expect(p.course).toBe('es');
    expect(p.completed).toEqual({ 'es-u1l1': { times: 1, bestAccuracy: 90 } });
    expect(p.courseXp).toEqual({ es: 40 });
  });

  it('leaves current saves alone and tracks XP per course', () => {
    const p = recordSession({ ...initialProgress(0), course: 'hi' }, { courseId: 'hi', xp: 15, accuracy: 100 }, day(1));
    const raw = JSON.stringify(p);
    expect(migrate(p, raw)).toBe(p);
    expect(p.courseXp).toEqual({ hi: 15 });
  });
});

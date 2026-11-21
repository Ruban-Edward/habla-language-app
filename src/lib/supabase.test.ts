import { describe, expect, it } from 'vitest';
import { initialProgress } from './progress';
import { parseCloudProgress } from './supabase';

describe('parseCloudProgress', () => {
  it('accepts a saved progress object', () => {
    const progress = initialProgress(123);
    expect(parseCloudProgress(progress)).toEqual(progress);
  });

  it('rejects malformed saved progress', () => {
    expect(parseCloudProgress({ ...initialProgress(123), completed: { lesson: null } })).toBeNull();
    expect(parseCloudProgress({ xp: 10 })).toBeNull();
    expect(parseCloudProgress({ ...initialProgress(123), wordReviews: 'invalid' })).toBeNull();
    expect(parseCloudProgress({ ...initialProgress(123), savedPhrases: [null] })).toBeNull();
    expect(parseCloudProgress({ ...initialProgress(123), showRoman: 'yes' })).toBeNull();
    expect(parseCloudProgress({ ...initialProgress(123), learningReason: 'fun' })).toBeNull();
    expect(parseCloudProgress({ ...initialProgress(123), recall: { es: { attempts: 1 } } })).toBeNull();
  });

  it('keeps valid dashboard history and drops malformed entries instead of rejecting the save', () => {
    const good = { at: 1, courseId: 'es', date: '2026-11-20', accuracy: 90, durationMs: 60000, xp: 10 };
    const parsed = parseCloudProgress({
      ...initialProgress(123),
      sessionHistory: [good, { date: '2026-11-20', accuracy: 90, durationMs: 0, xp: 10 }, null],
    });
    expect(parsed?.sessionHistory).toEqual([good]);
    const { sessionHistory: _omitted, ...older } = initialProgress(123);
    expect(parseCloudProgress(older)?.sessionHistory).toEqual([]);
  });

  it('upgrades valid older cloud saves with defaults for new learning features', () => {
    const legacy: Record<string, unknown> = { ...initialProgress(123) };
    for (const field of ['wordReviews', 'savedPhrases', 'showRoman', 'learningReason', 'missions', 'recall']) delete legacy[field];
    expect(parseCloudProgress(legacy)).toMatchObject({
      wordReviews: {},
      savedPhrases: [],
      showRoman: true,
      learningReason: null,
      missions: {},
      recall: {},
    });
  });
});

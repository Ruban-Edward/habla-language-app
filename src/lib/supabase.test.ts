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

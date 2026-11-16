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
  });
});

import { describe, expect, it } from 'vitest';
import { initialProgress, recordSession, type Progress } from './progress';
import { syncWithCloud, type CloudApi } from './sync';

const t = new Date(2025, 0, 1, 12).getTime();
const lesson = (p: Progress, lessonId: string) => recordSession(p, { courseId: 'es', lessonId, xp: 10, accuracy: 100 }, t);

/** An in-memory cloud save; `beforeWrite` can simulate another device writing first. */
function fakeCloud(initial: Progress | null) {
  let save = initial ? { progress: initial, updatedAt: 'v0' } : null;
  let version = 0;
  let writes = 0;
  let beforeWrite: (() => void) | null = null;
  const api: CloudApi = {
    load: async () => save,
    saveIfUnchanged: async (progress, expected) => {
      if (beforeWrite) {
        const hook = beforeWrite;
        beforeWrite = null;
        hook();
      }
      if ((save?.updatedAt ?? null) !== expected) return null;
      writes++;
      save = { progress, updatedAt: `v${++version}` };
      return save.updatedAt;
    },
  };
  return {
    api,
    get save() {
      return save;
    },
    get writes() {
      return writes;
    },
    writeFromOtherDevice(progress: Progress) {
      save = { progress, updatedAt: `other${++version}` };
    },
    onNextWrite(hook: () => void) {
      beforeWrite = hook;
    },
  };
}

describe('syncWithCloud', () => {
  const start = { ...initialProgress(t), course: 'es' };

  it('uploads local progress when the account has no save yet', async () => {
    const cloud = fakeCloud(null);
    const local = lesson(start, 'es-u1l1');
    const result = await syncWithCloud(local, null, cloud.api);
    expect(cloud.save?.progress).toEqual(local);
    expect(result.progress).toEqual(local);
  });

  it('skips the write when the cloud already matches', async () => {
    const cloud = fakeCloud(start);
    await syncWithCloud(start, { progress: start, updatedAt: 'v0' }, cloud.api);
    expect(cloud.writes).toBe(0);
  });

  it('merges instead of overwriting progress from another device', async () => {
    const base = lesson(start, 'es-u1l1');
    const cloud = fakeCloud(lesson(base, 'es-u1l2'));
    const result = await syncWithCloud(lesson(base, 'es-u1l3'), { progress: base, updatedAt: 'v0' }, cloud.api);
    expect(Object.keys(result.progress.completed).sort()).toEqual(['es-u1l1', 'es-u1l2', 'es-u1l3']);
    expect(result.progress.xp).toBe(30);
    expect(cloud.save?.progress).toEqual(result.progress);
  });

  it('re-reads and merges again when another device writes in between', async () => {
    const base = lesson(start, 'es-u1l1');
    const cloud = fakeCloud(base);
    cloud.onNextWrite(() => cloud.writeFromOtherDevice(lesson(base, 'es-u2l1')));
    const result = await syncWithCloud(lesson(base, 'es-u1l2'), { progress: base, updatedAt: 'v0' }, cloud.api);
    expect(Object.keys(result.progress.completed).sort()).toEqual(['es-u1l1', 'es-u1l2', 'es-u2l1']);
    expect(cloud.save?.progress.xp).toBe(30);
  });

  it('uses the cloud save as is when local progress belongs to another account', async () => {
    const theirs = lesson(start, 'es-u2l1');
    const cloud = fakeCloud(theirs);
    const result = await syncWithCloud(lesson(start, 'es-u1l1'), null, cloud.api, { replaceLocal: true });
    expect(result.progress).toEqual(theirs);
    expect(cloud.writes).toBe(0);
  });
});

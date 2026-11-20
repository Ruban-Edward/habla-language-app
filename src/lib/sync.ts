import { mergeProgress, sameProgress } from './merge';
import type { Progress } from './progress';
import { parseCloudProgress, type CloudSave } from './supabase';

/** What this device last agreed on with the cloud. */
export type SyncBase = { progress: Progress; updatedAt: string };

export type CloudApi = {
  load: () => Promise<CloudSave | null>;
  /** Returns the new timestamp, or null if the cloud changed since `expectedUpdatedAt`. */
  saveIfUnchanged: (progress: Progress, expectedUpdatedAt: string | null) => Promise<string | null>;
};

const MAX_ATTEMPTS = 4;

/**
 * Bring this device and the cloud into agreement: read the cloud save, merge it with local progress,
 * and write the result only if nobody else wrote in between (otherwise read and merge again).
 * Returns the merged progress and the new base. Skips the write when the cloud already has the result.
 */
export async function syncWithCloud(
  local: Progress,
  base: SyncBase | null,
  cloud: CloudApi,
  opts: { replaceLocal?: boolean } = {},
): Promise<SyncBase> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const remote = await cloud.load();
    // This device's progress belongs to a different account: use the cloud save instead of mixing them.
    if (remote && opts.replaceLocal) return { progress: remote.progress, updatedAt: remote.updatedAt };
    if (!remote) {
      const updatedAt = await cloud.saveIfUnchanged(local, null);
      if (updatedAt) return { progress: local, updatedAt };
      continue;
    }
    // The base only helps if it describes this account's save history.
    const merged = mergeProgress(local, remote.progress, base?.progress ?? null);
    if (sameProgress(merged, remote.progress)) return { progress: remote.progress, updatedAt: remote.updatedAt };
    const updatedAt = await cloud.saveIfUnchanged(merged, remote.updatedAt);
    if (updatedAt) return { progress: merged, updatedAt };
  }
  throw new Error('Progress changed on another device several times in a row. It will sync again shortly.');
}

const baseKey = (userId: string) => `habla:sync-base:${userId}`;
const OWNER_KEY = 'habla:progress-owner';

/** The account this browser's local progress was last synced with (null if never signed in). */
export function loadProgressOwner(): string | null {
  try {
    return localStorage.getItem(OWNER_KEY);
  } catch {
    return null;
  }
}

export function storeProgressOwner(userId: string): void {
  try {
    localStorage.setItem(OWNER_KEY, userId);
  } catch {
    // Without it, a later sign-in merges instead of replacing, which never loses progress.
  }
}

export function loadSyncBase(userId: string): SyncBase | null {
  try {
    const raw = localStorage.getItem(baseKey(userId));
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const { progress, updatedAt } = value as Record<string, unknown>;
    const parsed = parseCloudProgress(progress);
    return parsed && typeof updatedAt === 'string' ? { progress: parsed, updatedAt } : null;
  } catch {
    return null;
  }
}

export function storeSyncBase(userId: string, base: SyncBase): void {
  try {
    localStorage.setItem(baseKey(userId), JSON.stringify(base));
  } catch {
    // Without a stored base the next merge falls back to the safe "take the larger value" rules.
  }
}

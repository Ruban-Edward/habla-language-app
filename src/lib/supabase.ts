import { createClient } from '@supabase/supabase-js';
import { initialProgress, sessionHistoryOf } from './progress';
import type { LessonRecord, Progress, RecallStats, SavedPhrase, WordReview } from './progress';

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ContentIssue = 'translation' | 'unnatural' | 'regional' | 'difficulty' | 'audio' | 'other';
export const CONTENT_ISSUES: { id: ContentIssue; label: string }[] = [
  { id: 'translation', label: 'The translation is wrong' },
  { id: 'unnatural', label: 'It doesn’t sound natural' },
  { id: 'regional', label: 'It’s said differently where I live' },
  { id: 'difficulty', label: 'Too hard or too easy here' },
  { id: 'audio', label: 'The audio is wrong' },
  { id: 'other', label: 'Something else' },
];

type ContentReportRow = {
  user_id: string;
  course_id: string;
  /** Lesson or mission id the report came from. */
  context: string;
  target: string;
  meaning: string;
  issue: ContentIssue;
  comment: string | null;
};

type Database = {
  public: {
    Tables: {
      user_progress: {
        Row: { user_id: string; progress: Json; updated_at: string };
        Insert: { user_id: string; progress: Json; updated_at?: string };
        Update: { user_id?: string; progress?: Json; updated_at?: string };
        Relationships: [];
      };
      content_reports: {
        Row: ContentReportRow & { id: number; created_at: string };
        Insert: ContentReportRow;
        Update: Partial<ContentReportRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigError =
  !url && !key
    ? 'Add your Supabase project URL and anon key to .env.local to enable accounts and cloud sync.'
    : !url || !key
      ? 'Both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.'
      : null;

export const supabase =
  url && key ? createClient<Database>(url, key, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === 'number' && Number.isFinite(item));
}

function isLessonRecord(value: unknown): value is LessonRecord {
  return (
    isRecord(value) &&
    typeof value.times === 'number' &&
    Number.isFinite(value.times) &&
    typeof value.bestAccuracy === 'number' &&
    Number.isFinite(value.bestAccuracy)
  );
}

function isWordReview(value: unknown): value is WordReview {
  return (
    isRecord(value) &&
    typeof value.dueAt === 'number' &&
    Number.isFinite(value.dueAt) &&
    typeof value.intervalDays === 'number' &&
    Number.isFinite(value.intervalDays) &&
    typeof value.repetitions === 'number' &&
    Number.isFinite(value.repetitions) &&
    typeof value.lastReviewedAt === 'number' &&
    Number.isFinite(value.lastReviewedAt)
  );
}

function isSavedPhrase(value: unknown): value is SavedPhrase {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.courseId === 'string' &&
    typeof value.target === 'string' &&
    typeof value.meaning === 'string' &&
    (value.roman === undefined || typeof value.roman === 'string') &&
    typeof value.createdAt === 'number' &&
    Number.isFinite(value.createdAt)
  );
}

function isRecallStats(value: unknown): value is RecallStats {
  return (
    isRecord(value) &&
    typeof value.attempts === 'number' &&
    Number.isFinite(value.attempts) &&
    typeof value.correct === 'number' &&
    Number.isFinite(value.correct)
  );
}

const REASONS = new Set(['travel', 'people', 'work', 'curious']);

/** Fields added after the first release are optional so older cloud saves still load. */
function hasValidOptionalFields(value: Record<string, unknown>): boolean {
  const optional = (field: unknown, check: (v: unknown) => boolean) => field === undefined || check(field);
  return (
    optional(value.wordReviews, (v) => isRecord(v) && Object.values(v).every(isWordReview)) &&
    optional(value.savedPhrases, (v) => Array.isArray(v) && v.every(isSavedPhrase)) &&
    optional(value.showRoman, (v) => typeof v === 'boolean') &&
    optional(value.learningReason, (v) => v === null || (typeof v === 'string' && REASONS.has(v))) &&
    optional(value.missions, (v) => isRecord(v) && Object.values(v).every(isLessonRecord)) &&
    optional(value.recall, (v) => isRecord(v) && Object.values(v).every(isRecallStats)) &&
    optional(value.resetAt, (v) => typeof v === 'number' && Number.isFinite(v))
  );
}

function isProgress(value: unknown): value is Progress {
  if (!isRecord(value)) return false;
  if (
    typeof value.xp !== 'number' ||
    !Number.isFinite(value.xp) ||
    !isRecord(value.completed) ||
    !Object.values(value.completed).every(isLessonRecord) ||
    typeof value.hearts !== 'number' ||
    !Number.isFinite(value.hearts) ||
    typeof value.heartsUpdatedAt !== 'number' ||
    !Number.isFinite(value.heartsUpdatedAt) ||
    typeof value.streak !== 'number' ||
    !Number.isFinite(value.streak) ||
    (value.lastActiveDate !== null && typeof value.lastActiveDate !== 'string') ||
    !isNumberRecord(value.dailyXp) ||
    typeof value.dailyGoal !== 'number' ||
    !Number.isFinite(value.dailyGoal) ||
    typeof value.sound !== 'boolean' ||
    (value.course !== null && typeof value.course !== 'string') ||
    !isNumberRecord(value.courseXp) ||
    !hasValidOptionalFields(value)
  ) {
    return false;
  }
  return true;
}

export function parseCloudProgress(value: unknown): Progress | null {
  if (!isProgress(value)) return null;
  const defaults = initialProgress(Date.now());
  const present = Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined));
  return { ...defaults, ...present, sessionHistory: sessionHistoryOf(value.sessionHistory) } as Progress;
}


export type CloudSave = { progress: Progress; updatedAt: string };

/** Load the cloud save and the time it was written (used to detect changes from other devices). */
export async function loadCloudSave(userId: string): Promise<CloudSave | null> {
  if (!supabase) throw new Error(supabaseConfigError ?? 'Supabase is not configured.');
  const { data, error } = await supabase
    .from('user_progress')
    .select('progress, updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const progress = parseCloudProgress(data.progress);
  if (!progress) throw new Error('The saved cloud progress has an invalid format.');
  return { progress, updatedAt: data.updated_at };
}

/**
 * Write progress only if the cloud save hasn't changed since `expectedUpdatedAt` (null: only if there is
 * no save yet). Returns the new timestamp, or null when another device wrote first.
 */
export async function saveCloudSaveIfUnchanged(
  userId: string,
  progress: Progress,
  expectedUpdatedAt: string | null,
): Promise<string | null> {
  if (!supabase) throw new Error(supabaseConfigError ?? 'Supabase is not configured.');
  const updatedAt = new Date().toISOString();
  if (expectedUpdatedAt === null) {
    const { data, error } = await supabase
      .from('user_progress')
      .insert({ user_id: userId, progress, updated_at: updatedAt })
      .select('updated_at')
      .maybeSingle();
    // 23505: a save was created by another device in the meantime.
    if (error?.code === '23505') return null;
    if (error) throw error;
    return data?.updated_at ?? updatedAt;
  }
  const { data, error } = await supabase
    .from('user_progress')
    .update({ progress, updated_at: updatedAt })
    .eq('user_id', userId)
    .eq('updated_at', expectedUpdatedAt)
    .select('updated_at');
  if (error) throw error;
  return data.length ? data[0].updated_at : null;
}

/** Send a learner's report about a word or phrase so fluent speakers can review it. Requires sign-in. */
export async function reportContent(
  userId: string,
  report: Omit<ContentReportRow, 'user_id'>,
): Promise<void> {
  if (!supabase) throw new Error(supabaseConfigError ?? 'Supabase is not configured.');
  const comment = report.comment?.trim().slice(0, 1000) || null;
  const { error } = await supabase.from('content_reports').insert({ ...report, comment, user_id: userId });
  if (error) throw error;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

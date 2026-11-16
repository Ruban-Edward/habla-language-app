import { createClient } from '@supabase/supabase-js';
import type { LessonRecord, Progress } from './progress';

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Database = {
  public: {
    Tables: {
      user_progress: {
        Row: { user_id: string; progress: Json; updated_at: string };
        Insert: { user_id: string; progress: Json; updated_at?: string };
        Update: { user_id?: string; progress?: Json; updated_at?: string };
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
    !isNumberRecord(value.courseXp)
  ) {
    return false;
  }
  return true;
}

export function parseCloudProgress(value: unknown): Progress | null {
  return isProgress(value) ? value : null;
}

export async function loadCloudProgress(userId: string): Promise<Progress | null> {
  if (!supabase) throw new Error(supabaseConfigError ?? 'Supabase is not configured.');
  const { data, error } = await supabase
    .from('user_progress')
    .select('progress')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const progress = parseCloudProgress(data.progress);
  if (!progress) throw new Error('The saved cloud progress has an invalid format.');
  return progress;
}

export async function saveCloudProgress(userId: string, progress: Progress): Promise<void> {
  if (!supabase) throw new Error(supabaseConfigError ?? 'Supabase is not configured.');
  const { error } = await supabase.from('user_progress').upsert({
    user_id: userId,
    progress,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

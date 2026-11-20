create table public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "Users can read their own progress"
  on public.user_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own progress"
  on public.user_progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Learner reports about words and phrases, for review by fluent speakers.
-- Learners can submit reports but cannot read them; review them in the Supabase dashboard.
create table public.content_reports (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id text not null,
  context text not null,
  target text not null,
  meaning text not null,
  issue text not null check (issue in ('translation', 'unnatural', 'regional', 'difficulty', 'audio', 'other')),
  comment text check (char_length(comment) <= 1000),
  created_at timestamptz not null default now()
);

alter table public.content_reports enable row level security;

create policy "Users can submit their own content reports"
  on public.content_reports for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

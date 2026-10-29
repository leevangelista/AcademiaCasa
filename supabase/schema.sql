-- Esquema do App Academia.
-- Rode uma vez no Supabase: painel do projeto > SQL Editor > New query > colar tudo > Run.

-- Treinos (fichas): ex. "Treino A - Peito e tríceps"
create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- Exercícios de cada treino, com as séries e repetições planejadas
create table if not exists workout_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  workout_id uuid not null references workouts on delete cascade,
  position int not null,
  name text not null,
  sets int not null check (sets > 0),
  reps int not null check (reps > 0)
);

-- Registro de um dia de treino
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  workout_id uuid references workouts on delete set null,
  workout_name text not null,
  date date not null,
  created_at timestamptz not null default now()
);

-- Séries feitas naquele dia
create table if not exists session_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  session_id uuid not null references sessions on delete cascade,
  position int not null,
  exercise_name text not null,
  set_number int not null,
  reps int not null check (reps >= 0),
  weight numeric(6, 2) check (weight >= 0) -- kg, opcional
);

create index if not exists workout_exercises_workout_idx on workout_exercises (workout_id);
create index if not exists sessions_user_date_idx on sessions (user_id, date desc);
create index if not exists session_sets_session_idx on session_sets (session_id);

-- Cada usuário só enxerga e altera os próprios dados
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
alter table sessions enable row level security;
alter table session_sets enable row level security;

create policy "dono" on workouts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "dono" on workout_exercises for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "dono" on sessions for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "dono" on session_sets for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

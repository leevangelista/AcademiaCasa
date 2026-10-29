import { supabase } from "./supabase";
import type {
  LoggedSet,
  Session,
  SessionInput,
  Workout,
  WorkoutInput,
} from "./types";

// ---------- Supabase ----------

type WorkoutRow = {
  id: string;
  name: string;
  workout_exercises: { position: number; name: string; sets: number; reps: number }[];
};

type SessionRow = {
  id: string;
  workout_id: string | null;
  workout_name: string;
  date: string;
  session_sets: {
    position: number;
    exercise_name: string;
    set_number: number;
    reps: number;
    weight: number | string | null; // numeric pode chegar como texto
  }[];
};

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

function toWorkout(r: WorkoutRow): Workout {
  return {
    id: r.id,
    name: r.name,
    exercises: [...r.workout_exercises]
      .sort((a, b) => a.position - b.position)
      .map(({ name, sets, reps }) => ({ name, sets, reps })),
  };
}

function toSession(r: SessionRow): Session {
  return {
    id: r.id,
    workoutId: r.workout_id,
    workoutName: r.workout_name,
    date: r.date,
    sets: r.session_sets
      .map((s) => ({
        position: s.position,
        exercise: s.exercise_name,
        setNumber: s.set_number,
        reps: s.reps,
        weight: s.weight == null ? null : Number(s.weight),
      }))
      .sort((a, b) => a.position - b.position || a.setNumber - b.setNumber),
  };
}

const WORKOUT_COLS = "id,name,workout_exercises(position,name,sets,reps)";
const SESSION_COLS =
  "id,workout_id,workout_name,date,session_sets(position,exercise_name,set_number,reps,weight)";

const remote = {
  async listWorkouts(): Promise<Workout[]> {
    const rows = check(
      await supabase!.from("workouts").select(WORKOUT_COLS).order("created_at"),
    ) as WorkoutRow[];
    return rows.map(toWorkout);
  },

  async getWorkout(id: string): Promise<Workout | null> {
    const row = check(
      await supabase!.from("workouts").select(WORKOUT_COLS).eq("id", id).maybeSingle(),
    ) as WorkoutRow | null;
    return row && toWorkout(row);
  },

  async saveWorkout(w: WorkoutInput): Promise<void> {
    let id = w.id;
    if (id) {
      check(await supabase!.from("workouts").update({ name: w.name }).eq("id", id));
      check(await supabase!.from("workout_exercises").delete().eq("workout_id", id));
    } else {
      const row = check(
        await supabase!.from("workouts").insert({ name: w.name }).select("id").single(),
      ) as { id: string };
      id = row.id;
    }
    if (w.exercises.length) {
      check(
        await supabase!.from("workout_exercises").insert(
          w.exercises.map((e, i) => ({ workout_id: id, position: i, ...e })),
        ),
      );
    }
  },

  async deleteWorkout(id: string): Promise<void> {
    check(await supabase!.from("workouts").delete().eq("id", id));
  },

  async listSessions(): Promise<Session[]> {
    const rows = check(
      await supabase!
        .from("sessions")
        .select(SESSION_COLS)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(30),
    ) as SessionRow[];
    return rows.map(toSession);
  },

  async getSession(id: string): Promise<Session | null> {
    const row = check(
      await supabase!.from("sessions").select(SESSION_COLS).eq("id", id).maybeSingle(),
    ) as SessionRow | null;
    return row && toSession(row);
  },

  async saveSession(s: SessionInput): Promise<void> {
    const fields = { workout_id: s.workoutId, workout_name: s.workoutName, date: s.date };
    let id = s.id;
    if (id) {
      check(await supabase!.from("sessions").update(fields).eq("id", id));
      check(await supabase!.from("session_sets").delete().eq("session_id", id));
    } else {
      const row = check(
        await supabase!.from("sessions").insert(fields).select("id").single(),
      ) as { id: string };
      id = row.id;
    }
    if (s.sets.length) {
      check(
        await supabase!.from("session_sets").insert(
          s.sets.map((x: LoggedSet) => ({
            session_id: id,
            position: x.position,
            exercise_name: x.exercise,
            set_number: x.setNumber,
            reps: x.reps,
            weight: x.weight,
          })),
        ),
      );
    }
  },

  async deleteSession(id: string): Promise<void> {
    check(await supabase!.from("sessions").delete().eq("id", id));
  },
};

// ---------- Modo demonstração (localStorage) ----------

const KEY = "academia-demo";
type Store = { workouts: Workout[]; sessions: Session[] };

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Store;
  } catch {}
  return { workouts: [], sessions: [] };
}

function save(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {}
}

const local = {
  async listWorkouts() {
    return load().workouts;
  },
  async getWorkout(id: string) {
    return load().workouts.find((w) => w.id === id) ?? null;
  },
  async saveWorkout(w: WorkoutInput) {
    const store = load();
    const item: Workout = { ...w, id: w.id ?? crypto.randomUUID() };
    const i = store.workouts.findIndex((x) => x.id === item.id);
    if (i >= 0) store.workouts[i] = item;
    else store.workouts.push(item);
    save(store);
  },
  async deleteWorkout(id: string) {
    const store = load();
    store.workouts = store.workouts.filter((w) => w.id !== id);
    store.sessions = store.sessions.map((s) =>
      s.workoutId === id ? { ...s, workoutId: null } : s,
    );
    save(store);
  },
  async listSessions() {
    return [...load().sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
  },
  async getSession(id: string) {
    return load().sessions.find((s) => s.id === id) ?? null;
  },
  async saveSession(s: SessionInput) {
    const store = load();
    const item: Session = { ...s, id: s.id ?? crypto.randomUUID() };
    const i = store.sessions.findIndex((x) => x.id === item.id);
    if (i >= 0) store.sessions[i] = item;
    else store.sessions.unshift(item);
    save(store);
  },
  async deleteSession(id: string) {
    const store = load();
    store.sessions = store.sessions.filter((s) => s.id !== id);
    save(store);
  },
};

export const db = supabase ? remote : local;
export const demoMode = !supabase;

export type Exercise = {
  name: string;
  sets: number;
  reps: number;
};

export type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
};

export type LoggedSet = {
  position: number; // ordem do exercício no dia
  exercise: string;
  setNumber: number;
  reps: number;
  weight: number | null; // kg; null quando não informado
};

export type Session = {
  id: string;
  workoutId: string | null;
  workoutName: string;
  date: string; // AAAA-MM-DD
  sets: LoggedSet[];
};

export type WorkoutInput = Omit<Workout, "id"> & { id?: string };
export type SessionInput = Omit<Session, "id"> & { id?: string };

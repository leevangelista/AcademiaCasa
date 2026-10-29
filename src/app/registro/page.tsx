"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/db";
import type { LoggedSet, Session } from "@/lib/types";
import { formatDate, today } from "@/lib/util";
import { Button, Card, Header, Loading, Stepper } from "@/components/ui";
import ExerciseDemo from "@/components/ExerciseDemo";

// weight fica como texto enquanto se digita ("12,5"); vira número ao salvar
type SetRow = { reps: number; weight: string; done: boolean };
// lastDate: dia do registro usado para preencher (ausente = veio do plano do treino)
type Item = { name: string; sets: SetRow[]; lastDate?: string };

function formatWeight(w: number | null): string {
  return w == null ? "" : String(w).replace(".", ",");
}

function parseWeight(s: string): number | null {
  const n = Number(s.trim().replace(",", "."));
  return s.trim() && Number.isFinite(n) && n >= 0 ? n : null;
}

// Séries da última vez que o exercício foi feito: primeiro neste mesmo treino,
// depois em qualquer treino. As sessões já vêm da mais recente para a mais antiga.
function lastSets(
  sessions: Session[],
  workoutId: string,
  exercise: string,
): { date: string; sets: LoggedSet[] } | null {
  const find = (list: Session[]) => {
    for (const s of list) {
      const sets = s.sets.filter((x) => x.exercise === exercise);
      if (sets.length) return { date: s.date, sets };
    }
    return null;
  };
  return find(sessions.filter((s) => s.workoutId === workoutId)) ?? find(sessions);
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <LogSession />
    </Suspense>
  );
}

// Registro do dia: /registro?treino=ID (novo) ou /registro?id=ID (editar um dia já salvo)
function LogSession() {
  const params = useSearchParams();
  const sessionId = params.get("id") ?? undefined;
  const workoutParam = params.get("treino");
  const router = useRouter();

  const [workoutId, setWorkoutId] = useState<string | null>(workoutParam);
  const [workoutName, setWorkoutName] = useState("");
  const [date, setDate] = useState(today());
  const [items, setItems] = useState<Item[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (sessionId) {
      db.getSession(sessionId).then((s) => {
        if (!s) return setItems([]);
        setWorkoutId(s.workoutId);
        setWorkoutName(s.workoutName);
        setDate(s.date);
        const byPos = new Map<number, Item>();
        for (const x of s.sets) {
          const item = byPos.get(x.position) ?? { name: x.exercise, sets: [] };
          item.sets.push({ reps: x.reps, weight: formatWeight(x.weight), done: true });
          byPos.set(x.position, item);
        }
        setItems([...byPos.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v));
      });
    } else if (workoutParam) {
      Promise.all([db.getWorkout(workoutParam), db.listSessions()]).then(([w, sessions]) => {
        if (!w) return setItems([]);
        setWorkoutName(w.name);
        setItems(
          w.exercises.map((e) => {
            const last = lastSets(sessions, w.id, e.name);
            if (last) {
              return {
                name: e.name,
                lastDate: last.date,
                sets: last.sets.map((x) => ({
                  reps: x.reps,
                  weight: formatWeight(x.weight),
                  done: false,
                })),
              };
            }
            return {
              name: e.name,
              sets: Array.from({ length: e.sets }, () => ({
                reps: e.reps,
                weight: "",
                done: false,
              })),
            };
          }),
        );
      });
    } else {
      setItems([]);
    }
  }, [sessionId, workoutParam]);

  function updateSet(i: number, k: number, patch: Partial<SetRow>) {
    setItems((list) =>
      list!.map((item, j) =>
        j !== i
          ? item
          : { ...item, sets: item.sets.map((s, n) => (n === k ? { ...s, ...patch } : s)) },
      ),
    );
  }

  function addSet(i: number) {
    setItems((list) =>
      list!.map((item, j) => {
        if (j !== i) return item;
        const last = item.sets[item.sets.length - 1];
        return {
          ...item,
          sets: [...item.sets, { reps: last?.reps ?? 10, weight: last?.weight ?? "", done: true }],
        };
      }),
    );
  }

  function removeSet(i: number) {
    setItems((list) =>
      list!.map((item, j) => (j === i ? { ...item, sets: item.sets.slice(0, -1) } : item)),
    );
  }

  function toggleAll(i: number) {
    const allDone = items![i].sets.every((s) => s.done);
    setItems((list) =>
      list!.map((item, j) =>
        j === i ? { ...item, sets: item.sets.map((s) => ({ ...s, done: !allDone })) } : item,
      ),
    );
  }

  async function submit() {
    const sets: LoggedSet[] = [];
    items!.forEach((item, position) => {
      item.sets
        .filter((s) => s.done)
        .forEach((s, n) =>
          sets.push({
            position,
            exercise: item.name,
            setNumber: n + 1,
            reps: s.reps,
            weight: parseWeight(s.weight),
          }),
        );
    });
    if (sets.length === 0) return alert("Marque pelo menos uma série como feita (✓).");
    setBusy(true);
    try {
      await db.saveSession({ id: sessionId, workoutId, workoutName, date, sets });
      router.push("/");
    } catch (e) {
      alert("Não foi possível salvar: " + (e as Error).message);
      setBusy(false);
    }
  }

  async function remove() {
    if (!sessionId || !confirm("Excluir este registro?")) return;
    await db.deleteSession(sessionId);
    router.push("/");
  }

  if (!items) return <Loading />;
  if (items.length === 0)
    return (
      <div>
        <Header title="Registro" back="/" />
        <p className="text-muted">Treino não encontrado.</p>
      </div>
    );

  const doneCount = items.reduce((n, it) => n + it.sets.filter((s) => s.done).length, 0);
  const totalCount = items.reduce((n, it) => n + it.sets.length, 0);

  return (
    <div className="flex flex-col gap-4">
      <Header title={workoutName} back="/" />

      <div className="flex items-center justify-between">
        <input
          type="date"
          className="h-11 rounded-xl border border-border bg-card px-3"
          value={date}
          onChange={(e) => setDate(e.target.value || today())}
        />
        <span className="text-sm text-muted tabular-nums">
          {doneCount}/{totalCount} séries feitas
        </span>
      </div>

      {items.map((item, i) => (
        <Card key={i} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">{item.name}</p>
            <button className="text-sm text-accent" onClick={() => toggleAll(i)}>
              {item.sets.every((s) => s.done) ? "Desmarcar" : "Marcar todas"}
            </button>
          </div>
          {item.lastDate && (
            <p className="-mt-2 text-xs text-muted">
              Preenchido com o treino de {formatDate(item.lastDate)}
            </p>
          )}
          <ExerciseDemo name={item.name} />

          {item.sets.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="w-8 text-center">Série</span>
              <span className="w-[136px] text-center">Repetições</span>
              <span className="flex-1 text-center">Peso (kg)</span>
              <span className="w-11" />
            </div>
          )}

          {item.sets.map((s, k) => (
            <div key={k} className="flex items-center gap-2">
              <span className="w-8 text-center font-semibold text-muted">{k + 1}</span>
              <Stepper
                value={s.reps}
                label={`Repetições da série ${k + 1}`}
                onChange={(v) => updateSet(i, k, { reps: v })}
              />
              <input
                type="text"
                inputMode="decimal"
                placeholder="–"
                aria-label={`Peso em kg da série ${k + 1}`}
                className="h-10 w-full min-w-0 flex-1 rounded-lg border border-border bg-background text-center font-semibold tabular-nums outline-none focus:ring-2 focus:ring-accent"
                value={s.weight}
                onChange={(e) =>
                  updateSet(i, k, { weight: e.target.value.replace(/[^0-9.,]/g, "") })
                }
                onFocus={(e) => e.target.select()}
              />
              <button
                aria-label={s.done ? "Série feita" : "Marcar série como feita"}
                aria-pressed={s.done}
                onClick={() => updateSet(i, k, { done: !s.done })}
                className={`h-11 w-11 rounded-full border-2 text-xl font-bold transition active:scale-90 ${
                  s.done ? "border-accent bg-accent text-white" : "border-border text-transparent"
                }`}
              >
                ✓
              </button>
            </div>
          ))}

          <div className="flex justify-between pt-1 text-sm">
            <button className="text-accent" onClick={() => addSet(i)}>
              + Série
            </button>
            {item.sets.length > 0 && (
              <button className="text-muted" onClick={() => removeSet(i)}>
                − Remover última
              </button>
            )}
          </div>
        </Card>
      ))}

      <Button onClick={submit} disabled={busy}>
        Salvar registro
      </Button>
      {sessionId && (
        <Button variant="danger" onClick={remove}>
          Excluir registro
        </Button>
      )}
    </div>
  );
}

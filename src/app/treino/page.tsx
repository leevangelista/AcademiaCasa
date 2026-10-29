"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/db";
import type { Exercise } from "@/lib/types";
import { Button, Card, Header, Loading, Stepper } from "@/components/ui";
import ExerciseDemo from "@/components/ExerciseDemo";
import ExercisePicker from "@/components/ExercisePicker";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <EditWorkout />
    </Suspense>
  );
}

// Cria (/treino) ou edita (/treino?id=...) um treino
function EditWorkout() {
  const id = useSearchParams().get("id") ?? undefined;
  const router = useRouter();
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loaded, setLoaded] = useState(!id);
  const [busy, setBusy] = useState(false);
  // null: seletor fechado; "new": adicionar; número: trocar o exercício nessa posição
  const [picking, setPicking] = useState<"new" | number | null>(null);

  useEffect(() => {
    if (!id) return;
    db.getWorkout(id).then((w) => {
      if (w) {
        setName(w.name);
        setExercises(w.exercises);
      }
      setLoaded(true);
    });
  }, [id]);

  function update(i: number, patch: Partial<Exercise>) {
    setExercises((list) => list.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  }

  function move(i: number, dir: -1 | 1) {
    setExercises((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const copy = [...list];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  async function submit() {
    const clean = exercises
      .map((e) => ({ ...e, name: e.name.trim() }))
      .filter((e) => e.name);
    if (!name.trim()) return alert("Dê um nome ao treino.");
    if (clean.length === 0) return alert("Adicione pelo menos um exercício.");
    setBusy(true);
    try {
      await db.saveWorkout({ id, name: name.trim(), exercises: clean });
      router.push("/");
    } catch (e) {
      alert("Não foi possível salvar: " + (e as Error).message);
      setBusy(false);
    }
  }

  async function remove() {
    if (!id || !confirm("Excluir este treino? O histórico já registrado continua.")) return;
    await db.deleteWorkout(id);
    router.push("/");
  }

  if (!loaded) return <Loading />;

  const field =
    "h-12 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="flex flex-col gap-4">
      <Header title={id ? "Editar treino" : "Novo treino"} back="/" />

      <input
        className={field}
        placeholder="Nome do treino (ex.: Treino A – Peito)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {exercises.map((e, i) => (
        <Card key={i} className="flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <span className="w-6 pt-0.5 text-center font-semibold text-muted">{i + 1}</span>
            <div className="flex-1">
              <p className="text-lg font-semibold leading-tight">{e.name}</p>
              <ExerciseDemo key={e.name} name={e.name} />
            </div>
            <button className="pt-0.5 text-sm text-muted" onClick={() => setPicking(i)}>
              Trocar
            </button>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted">Séries</span>
              <Stepper value={e.sets} min={1} label="Séries" onChange={(v) => update(i, { sets: v })} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted">Repetições</span>
              <Stepper value={e.reps} min={1} label="Repetições" onChange={(v) => update(i, { reps: v })} />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex gap-4 text-muted">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30">
                ↑ Subir
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === exercises.length - 1}
                className="disabled:opacity-30"
              >
                ↓ Descer
              </button>
            </div>
            <button
              className="text-danger"
              onClick={() => setExercises((list) => list.filter((_, j) => j !== i))}
            >
              Remover
            </button>
          </div>
        </Card>
      ))}

      <Button variant="secondary" onClick={() => setPicking("new")}>
        + Adicionar exercício
      </Button>

      {picking !== null && (
        <ExercisePicker
          onClose={() => setPicking(null)}
          onPick={(picked) => {
            if (picking === "new") {
              setExercises((list) => [...list, { name: picked, sets: 3, reps: 12 }]);
            } else {
              update(picking, { name: picked });
            }
            setPicking(null);
          }}
        />
      )}

      <Button onClick={submit} disabled={busy}>
        Salvar treino
      </Button>
      {id && (
        <Button variant="danger" onClick={remove}>
          Excluir treino
        </Button>
      )}
    </div>
  );
}

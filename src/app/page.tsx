"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import type { Session, Workout } from "@/lib/types";
import { formatDate } from "@/lib/util";
import { Card, LinkButton, Loading } from "@/components/ui";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([db.listWorkouts(), db.listSessions()])
      .then(([w, s]) => {
        setWorkouts(w);
        setSessions(s);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) return <p className="py-10 text-center text-danger">Erro: {error}</p>;
  if (!workouts) return <Loading />;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Academia</h1>
        {supabase && (
          <button className="text-sm text-muted" onClick={() => supabase!.auth.signOut()}>
            Sair
          </button>
        )}
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Meus treinos</h2>
        {workouts.length === 0 && (
          <Card className="text-center text-muted">
            Nenhum treino ainda. Crie o primeiro abaixo.
          </Card>
        )}
        {workouts.map((w) => (
          <Card key={w.id} className="flex flex-col gap-3">
            <div>
              <p className="text-lg font-semibold">{w.name}</p>
              <p className="text-sm text-muted">
                {w.exercises.length} exercício{w.exercises.length === 1 ? "" : "s"}
                {w.exercises.length > 0 &&
                  " · " + w.exercises.map((e) => e.name).join(", ")}
              </p>
            </div>
            <div className="flex gap-2">
              <LinkButton href={`/registro?treino=${w.id}`} className="flex-1">
                Registrar hoje
              </LinkButton>
              <LinkButton href={`/treino?id=${w.id}`} variant="secondary">
                Editar
              </LinkButton>
            </div>
          </Card>
        ))}
        <LinkButton href="/treino" variant="secondary">
          + Novo treino
        </LinkButton>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Histórico</h2>
        {sessions.length === 0 && (
          <p className="text-sm text-muted">Os treinos registrados vão aparecer aqui.</p>
        )}
        {sessions.map((s) => {
          const exercises = new Set(s.sets.map((x) => x.position)).size;
          return (
            <Link key={s.id} href={`/registro?id=${s.id}`}>
              <Card className="flex items-center justify-between active:opacity-70">
                <div>
                  <p className="font-semibold">{s.workoutName}</p>
                  <p className="text-sm text-muted">
                    {exercises} exercício{exercises === 1 ? "" : "s"} · {s.sets.length} série
                    {s.sets.length === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="text-sm text-muted capitalize">{formatDate(s.date)}</span>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { findExercise } from "@/lib/biblioteca";

// Botão "Ver execução": só carrega e anima as fotos depois do toque
export default function ExerciseDemo({ name }: { name: string }) {
  const exercise = findExercise(name);
  const [open, setOpen] = useState(false);

  if (!exercise) return null;

  return (
    <div>
      <button
        type="button"
        className="text-sm font-medium text-accent"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "▾ Fechar execução" : "▶ Ver execução"}
      </button>
      {open && <Animation id={exercise.id} name={exercise.name} />}
    </div>
  );
}

export function Animation({ id, name }: { id: string; name: string }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFrame((f) => 1 - f), 900);
    return () => clearInterval(t);
  }, []);

  // As duas fotos ficam empilhadas; alternar a opacidade evita piscar enquanto carregam
  return (
    <div className="relative mt-2 aspect-[3/2] w-full overflow-hidden rounded-xl bg-background">
      {[0, 1].map((n) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={n}
          src={`/exercicios/${id}-${n}.jpg`}
          alt={n === 0 ? `${name}: início do movimento` : `${name}: fim do movimento`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            frame === n ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

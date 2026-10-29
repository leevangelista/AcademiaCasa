"use client";

import { useEffect, useMemo, useState } from "react";
import { GROUPS, LIBRARY, normalize } from "@/lib/biblioteca";
import { Animation } from "./ExerciseDemo";

// Tela cheia para escolher um exercício da biblioteca (ou digitar um personalizado)
export default function ExercisePicker({
  onPick,
  onClose,
}: {
  onPick: (name: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const q = normalize(query.trim());
  const results = useMemo(
    () =>
      LIBRARY.filter(
        (e) => (!group || e.group === group) && (!q || normalize(e.name).includes(q)),
      ),
    [q, group],
  );
  const exact = LIBRARY.some((e) => normalize(e.name) === q);

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-3 h-9 text-sm font-medium border ${
      active ? "bg-accent text-white border-accent" : "bg-card border-border"
    }`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Escolher exercício"
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      <div className="mx-auto w-full max-w-lg px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Escolher exercício</h2>
          <button className="px-2 py-1 font-medium text-accent" onClick={onClose}>
            Cancelar
          </button>
        </div>
        <input
          autoFocus
          className="h-12 w-full rounded-xl border border-border bg-card px-3 outline-none focus:ring-2 focus:ring-accent"
          placeholder="Buscar (ex.: supino, rosca)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-3">
          <button className={chip(!group)} onClick={() => setGroup(null)}>
            Todos
          </button>
          {GROUPS.map((g) => (
            <button key={g} className={chip(group === g)} onClick={() => setGroup(g)}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <ul className="mx-auto w-full max-w-lg flex-1 overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {q && !exact && (
          <li className="mb-2">
            <button
              className="w-full rounded-xl border border-dashed border-border p-3 text-left"
              onClick={() => onPick(query.trim())}
            >
              <span className="font-semibold">Usar “{query.trim()}”</span>
              <span className="block text-sm text-muted">Exercício personalizado, sem animação</span>
            </button>
          </li>
        )}
        {results.map((e) => (
          <li key={e.id} className="border-b border-border py-2">
            <div className="flex items-center gap-2">
              <button className="flex-1 py-1 text-left" onClick={() => onPick(e.name)}>
                <span className="block font-semibold">{e.name}</span>
                <span className="text-sm text-muted">{e.group}</span>
              </button>
              <button
                className="h-9 rounded-lg px-3 text-sm font-medium text-accent"
                aria-expanded={preview === e.id}
                onClick={() => setPreview((p) => (p === e.id ? null : e.id))}
              >
                {preview === e.id ? "Fechar" : "▶ Ver"}
              </button>
              <button
                className="h-9 rounded-lg bg-accent px-3 text-sm font-semibold text-white"
                onClick={() => onPick(e.name)}
              >
                Adicionar
              </button>
            </div>
            {preview === e.id && <Animation id={e.id} name={e.name} />}
          </li>
        ))}
        {results.length === 0 && !q && (
          <li className="py-6 text-center text-muted">Nenhum exercício neste grupo.</li>
        )}
      </ul>
    </div>
  );
}

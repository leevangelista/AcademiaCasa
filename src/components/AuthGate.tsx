"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Button, Card, Loading } from "./ui";

// Mostra o login enquanto não houver sessão no Supabase.
// Sem Supabase configurado (modo demonstração), libera direto.
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(
    supabase ? undefined : null,
  );

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return (
      <>
        <p className="mb-4 rounded-xl bg-accent-soft px-3 py-2 text-sm">
          Modo demonstração: os dados ficam só neste aparelho.
        </p>
        {children}
      </>
    );
  }
  if (session === undefined) return <Loading />;
  if (!session) return <Login />;
  return <>{children}</>;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) setError("E-mail ou senha incorretos.");
    setBusy(false);
  }

  const field =
    "h-12 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="pt-16">
      <h1 className="mb-6 text-center text-3xl font-bold">Academia</h1>
      <Card>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            className={field}
            type="email"
            autoComplete="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={field}
            type="password"
            autoComplete="current-password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={busy}>
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
}

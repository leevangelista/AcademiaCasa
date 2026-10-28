"use client";

import Link from "next/link";

const base =
  "inline-flex items-center justify-center rounded-xl px-4 h-12 font-semibold transition active:scale-[0.98] disabled:opacity-50";

const variants = {
  primary: "bg-accent text-white",
  secondary: "bg-card border border-border",
  danger: "text-danger",
  ghost: "text-muted",
};

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl bg-card border border-border p-4 ${className}`} {...props} />;
}

export function Header({ title, back }: { title: string; back?: string }) {
  return (
    <header className="mb-4 flex items-center gap-2">
      {back && (
        <Link href={back} className="-ml-2 px-2 py-1 text-2xl text-accent" aria-label="Voltar">
          ‹
        </Link>
      )}
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}

// Campo numérico com botões − e + grandes para usar com o dedo
export function Stepper({
  value,
  onChange,
  min = 0,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  label?: string;
}) {
  const btn =
    "h-10 w-10 rounded-lg bg-background border border-border text-xl font-semibold active:scale-95";
  return (
    <div className="flex items-center gap-1" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        className="h-10 w-12 rounded-lg bg-transparent text-center font-semibold tabular-nums outline-none focus:ring-2 focus:ring-accent"
        value={value}
        min={min}
        aria-label={label}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
        onFocus={(e) => e.target.select()}
      />
      <button type="button" className={btn} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}

export function Loading() {
  return <p className="py-10 text-center text-muted">Carregando…</p>;
}

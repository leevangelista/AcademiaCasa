// Datas no formato AAAA-MM-DD, sempre no fuso do aparelho
export function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Data de um timestamp (ex.: created_at) como 15/10/2026
export function formatDay(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

// Sugestões que aparecem ao digitar o nome do exercício
export const EXERCICIOS = [
  "Supino reto",
  "Supino inclinado",
  "Supino declinado",
  "Crucifixo",
  "Crossover",
  "Flexão de braço",
  "Puxada frontal",
  "Barra fixa",
  "Remada curvada",
  "Remada baixa",
  "Remada unilateral",
  "Pulldown",
  "Desenvolvimento",
  "Elevação lateral",
  "Elevação frontal",
  "Crucifixo inverso",
  "Encolhimento",
  "Rosca direta",
  "Rosca alternada",
  "Rosca martelo",
  "Rosca scott",
  "Tríceps pulley",
  "Tríceps corda",
  "Tríceps testa",
  "Tríceps francês",
  "Mergulho",
  "Agachamento livre",
  "Agachamento no smith",
  "Leg press",
  "Hack",
  "Cadeira extensora",
  "Mesa flexora",
  "Cadeira flexora",
  "Stiff",
  "Levantamento terra",
  "Afundo",
  "Búlgaro",
  "Cadeira abdutora",
  "Cadeira adutora",
  "Elevação pélvica",
  "Panturrilha em pé",
  "Panturrilha sentado",
  "Abdominal",
  "Prancha",
];

// Datas no formato AAAA-MM-DD, sempre no fuso do aparelho
export function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

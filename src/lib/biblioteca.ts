// Gerado a partir do free-exercise-db (domínio público, github.com/yuhonas/free-exercise-db).
// Cada exercício tem duas fotos em public/exercicios: <id>-0.jpg (início) e <id>-1.jpg (fim).

export type LibraryExercise = { id: string; name: string; group: string };

export const LIBRARY: LibraryExercise[] = [
  { id: "supino-reto", name: "Supino reto", group: "Peito" },
  { id: "supino-reto-com-halteres", name: "Supino reto com halteres", group: "Peito" },
  { id: "supino-inclinado", name: "Supino inclinado", group: "Peito" },
  { id: "supino-inclinado-com-halteres", name: "Supino inclinado com halteres", group: "Peito" },
  { id: "supino-declinado", name: "Supino declinado", group: "Peito" },
  { id: "supino-maquina", name: "Supino máquina", group: "Peito" },
  { id: "crucifixo", name: "Crucifixo", group: "Peito" },
  { id: "crucifixo-inclinado", name: "Crucifixo inclinado", group: "Peito" },
  { id: "crossover", name: "Crossover", group: "Peito" },
  { id: "voador-peck-deck", name: "Voador (peck deck)", group: "Peito" },
  { id: "flexao-de-braco", name: "Flexão de braço", group: "Peito" },
  { id: "paralelas", name: "Paralelas", group: "Peito" },
  { id: "puxada-frontal", name: "Puxada frontal", group: "Costas" },
  { id: "puxada-fechada", name: "Puxada fechada", group: "Costas" },
  { id: "barra-fixa", name: "Barra fixa", group: "Costas" },
  { id: "barra-fixa-supinada", name: "Barra fixa supinada", group: "Costas" },
  { id: "remada-curvada", name: "Remada curvada", group: "Costas" },
  { id: "remada-baixa", name: "Remada baixa", group: "Costas" },
  { id: "remada-unilateral", name: "Remada unilateral", group: "Costas" },
  { id: "remada-cavalinho", name: "Remada cavalinho", group: "Costas" },
  { id: "pulldown", name: "Pulldown", group: "Costas" },
  { id: "levantamento-terra", name: "Levantamento terra", group: "Costas" },
  { id: "desenvolvimento-com-barra", name: "Desenvolvimento com barra", group: "Ombros" },
  { id: "desenvolvimento-com-halteres", name: "Desenvolvimento com halteres", group: "Ombros" },
  { id: "desenvolvimento-arnold", name: "Desenvolvimento Arnold", group: "Ombros" },
  { id: "desenvolvimento-maquina", name: "Desenvolvimento máquina", group: "Ombros" },
  { id: "elevacao-lateral", name: "Elevação lateral", group: "Ombros" },
  { id: "elevacao-frontal", name: "Elevação frontal", group: "Ombros" },
  { id: "crucifixo-inverso", name: "Crucifixo inverso", group: "Ombros" },
  { id: "face-pull", name: "Face pull", group: "Ombros" },
  { id: "remada-alta", name: "Remada alta", group: "Ombros" },
  { id: "encolhimento", name: "Encolhimento", group: "Ombros" },
  { id: "rosca-direta", name: "Rosca direta", group: "Bíceps" },
  { id: "rosca-com-halteres", name: "Rosca com halteres", group: "Bíceps" },
  { id: "rosca-alternada", name: "Rosca alternada", group: "Bíceps" },
  { id: "rosca-martelo", name: "Rosca martelo", group: "Bíceps" },
  { id: "rosca-scott", name: "Rosca scott", group: "Bíceps" },
  { id: "rosca-concentrada", name: "Rosca concentrada", group: "Bíceps" },
  { id: "triceps-pulley", name: "Tríceps pulley", group: "Tríceps" },
  { id: "triceps-corda", name: "Tríceps corda", group: "Tríceps" },
  { id: "triceps-testa", name: "Tríceps testa", group: "Tríceps" },
  { id: "triceps-frances", name: "Tríceps francês", group: "Tríceps" },
  { id: "triceps-coice", name: "Tríceps coice", group: "Tríceps" },
  { id: "mergulho-no-banco", name: "Mergulho no banco", group: "Tríceps" },
  { id: "agachamento-livre", name: "Agachamento livre", group: "Pernas" },
  { id: "agachamento-no-smith", name: "Agachamento no smith", group: "Pernas" },
  { id: "agachamento-goblet", name: "Agachamento goblet", group: "Pernas" },
  { id: "agachamento-sumo", name: "Agachamento sumô", group: "Pernas" },
  { id: "leg-press", name: "Leg press", group: "Pernas" },
  { id: "hack", name: "Hack", group: "Pernas" },
  { id: "cadeira-extensora", name: "Cadeira extensora", group: "Pernas" },
  { id: "mesa-flexora", name: "Mesa flexora", group: "Pernas" },
  { id: "cadeira-flexora", name: "Cadeira flexora", group: "Pernas" },
  { id: "stiff", name: "Stiff", group: "Pernas" },
  { id: "levantamento-terra-romeno", name: "Levantamento terra romeno", group: "Pernas" },
  { id: "afundo", name: "Afundo", group: "Pernas" },
  { id: "bulgaro", name: "Búlgaro", group: "Pernas" },
  { id: "cadeira-abdutora", name: "Cadeira abdutora", group: "Pernas" },
  { id: "cadeira-adutora", name: "Cadeira adutora", group: "Pernas" },
  { id: "elevacao-pelvica", name: "Elevação pélvica", group: "Glúteos" },
  { id: "ponte-de-gluteo", name: "Ponte de glúteo", group: "Glúteos" },
  { id: "gluteo-coice", name: "Glúteo coice", group: "Glúteos" },
  { id: "panturrilha-em-pe", name: "Panturrilha em pé", group: "Panturrilha" },
  { id: "panturrilha-sentado", name: "Panturrilha sentado", group: "Panturrilha" },
  { id: "panturrilha-no-leg-press", name: "Panturrilha no leg press", group: "Panturrilha" },
  { id: "abdominal", name: "Abdominal", group: "Abdômen" },
  { id: "abdominal-na-polia", name: "Abdominal na polia", group: "Abdômen" },
  { id: "abdominal-infra", name: "Abdominal infra", group: "Abdômen" },
  { id: "elevacao-de-pernas", name: "Elevação de pernas", group: "Abdômen" },
  { id: "prancha", name: "Prancha", group: "Abdômen" },
  { id: "prancha-lateral", name: "Prancha lateral", group: "Abdômen" },
  { id: "russian-twist", name: "Russian twist", group: "Abdômen" },
  { id: "escalador", name: "Escalador", group: "Abdômen" },
];

export const GROUPS = [...new Set(LIBRARY.map((e) => e.group))];

// Compara nomes sem acento e sem diferença de maiúsculas
export function normalize(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const byName = new Map(LIBRARY.map((e) => [normalize(e.name), e]));

export function findExercise(name: string): LibraryExercise | undefined {
  return byName.get(normalize(name.trim()));
}

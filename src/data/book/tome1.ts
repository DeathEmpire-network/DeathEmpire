/**
 * Tome I data - DeathEmpire Book of Lore (MVP)
 * Fuente narrativa: docs/lore/CAPITULO_1..10_*.md (canon normativo).
 * Metadatos editoriales para índice, fichas y navegación.
 * El texto narrativo completo vive en ./narratives.ts (caps 1-5) o
 * queda como placeholder (caps 6-10: ficha + aviso).
 */

export interface ChapterMeta {
  id: string;
  slug: string;
  order: number;
  status: 'canon' | 'development';
  periodEs: string;
  periodEn: string;
  readingMinutes: number | null;
  titleEs: string;
  subtitleEs: string;
  summaryEs: string;
  titleEn: string;
  subtitleEn: string;
  summaryEn: string;
  keysEs: string[];
  keysEn: string[];
  consequencesEs: string;
  consequencesEn: string;
  characters: string[];
  factions: string[];
  sourceFile: string;
  hasFullText: boolean;
}

export const tome = {
  id: 'tome-1',
  number: 1,
  titleEs: 'Tomo I · El cielo que cayó',
  titleEn: 'Tome I · The Fallen Sky',
  subtitleEs: 'Temporada 1: del Esplendor al Niño del Nivel 78',
  subtitleEn: 'Season 1: from Splendor to the Level 78 Child',
  totalChapters: 10,
};

export const chapters: ChapterMeta[] = [
  {
    id: 'era-esplendor',
    slug: 'chapter-1',
    order: 1,
    status: 'canon',
    periodEs: 'Era pre-maná',
    periodEn: 'Pre-Mana Era',
    readingMinutes: 10,
    titleEs: 'La Era del Esplendor',
    subtitleEs: 'El apogeo antes de la caída',
    summaryEs:
      'Ingeniería y academias antes de la palabra "maná". El orgullo técnico, el recurso invisible y la decisión de convertir el misterio en herramienta.',
    titleEn: 'The Era of Splendor',
    subtitleEn: 'The height before the fall',
    summaryEn:
      'Engineering and academies before the word "mana". Technical pride, the invisible resource, and the decision to turn mystery into a tool.',
    keysEs: ['Academias', 'Resonantes', 'Magia como técnica'],
    keysEn: ['Academies', 'Resonants', 'Magic as technique'],
    consequencesEs: 'Nace la Era del Maná y la cuenta que habrá que saldar.',
    consequencesEn: 'The Mana Era begins — and the bill that will come due.',
    characters: ['Investigadora sin nombre', 'Estudiantes rebeldes'],
    factions: [],
    sourceFile: 'docs/lore/CAPITULO_1_LA_ERA_DEL_ESPLENDOR.md',
    hasFullText: true,
  },
  {
    id: 'despertar-mana',
    slug: 'chapter-2',
    order: 2,
    status: 'canon',
    periodEs: 'El Despertar',
    periodEn: 'The Awakening',
    readingMinutes: 11,
    titleEs: 'El Despertar del Maná',
    subtitleEs: 'Cuando la magia dejó de obedecer',
    summaryEs:
      'Academias como filtros del destino, resonantes apartados, milagros que ya no pudieron ocultarse y la burocratización del poder.',
    titleEn: 'The Awakening of Mana',
    subtitleEn: 'When magic stopped obeying',
    summaryEn:
      'Academies as filters of fate, resonant children set apart, miracles that could no longer be hidden, and power turned into paperwork.',
    keysEs: ['Resonantes', 'Academias', 'Tendencias elementales'],
    keysEn: ['Resonants', 'Academies', 'Elemental leanings'],
    consequencesEs: 'Una élite de afinidad al servicio de los reinos; el mundo empuja contra su propia estructura.',
    consequencesEn: 'An affinity elite serving the realms; the world pushes against its own frame.',
    characters: ['Niño del fuego en suspensión', 'Niña de la mascota', 'Estudiante del norte'],
    factions: [],
    sourceFile: 'docs/lore/CAPITULO_2_EL_DESPERTAR_DEL_MANA.md',
    hasFullText: true,
  },
  {
    id: 'cielo-cayo',
    slug: 'chapter-3',
    order: 3,
    status: 'canon',
    periodEs: 'La Gran Catástrofe',
    periodEn: 'The Great Catastrophe',
    readingMinutes: 12,
    titleEs: 'El Cielo que Cayó',
    subtitleEs: 'El meteorito, la Barrera y la DeathZone',
    summaryEs:
      'El meteorito previsto, la cooperación imposible, la Barrera Mágica hexagonal, la resonancia que potenció en vez de cancelar… y la Miasma.',
    titleEn: 'The Fallen Sky',
    subtitleEn: 'Meteor, Barrier and DeathZone',
    summaryEn:
      'The foreseen meteor, the impossible cooperation, the hexagonal Magic Barrier, the resonance that amplified instead of cancelling… and the Miasma.',
    keysEs: ['Meteorito', 'Barrera Mágica', 'Miasma', 'DeathZone'],
    keysEn: ['Meteor', 'Magic Barrier', 'Miasma', 'DeathZone'],
    consequencesEs: 'Nacen la DeathZone, la Miasma y las Bestias; el mundo queda reescrito.',
    consequencesEn: 'The DeathZone, the Miasma and the Beasts are born; the world is rewritten.',
    characters: ['El invocador del panel que cedió', 'Veterano de la Barrera'],
    factions: [],
    sourceFile: 'docs/lore/CAPITULO_3_EL_CIELO_QUE_CAYO.md',
    hasFullText: true,
  },
  {
    id: 'bestias-espacio',
    slug: 'chapter-4',
    order: 4,
    status: 'canon',
    periodEs: 'Post-caída',
    periodEn: 'Aftermath',
    readingMinutes: 11,
    titleEs: 'Las Bestias del Espacio',
    subtitleEs: 'Veneno, murallas y dungeons que laten',
    summaryEs:
      'Lo que trajo el meteorito además de roca: veneno que se respira, murallas que separan dos mundos y dungeons que responden a quien entra.',
    titleEn: 'The Beasts from Beyond',
    subtitleEn: 'Venom, walls and dungeons that breathe',
    summaryEn:
      'What the meteor brought besides rock: venom in the air, walls splitting two worlds, and dungeons that answer whoever enters.',
    keysEs: ['Bestias', 'Veneno', 'Murallas', 'Dungeons'],
    keysEn: ['Beasts', 'Venom', 'Walls', 'Dungeons'],
    consequencesEs: 'Zonas seguras y salvajes; economía de caza; la DeathZone observa.',
    consequencesEn: 'Safe and wild zones; a hunting economy; the DeathZone watches.',
    characters: ['Cazadores veteranos', 'Alquimistas', 'Sacerdotisas'],
    factions: [],
    sourceFile: 'docs/lore/CAPITULO_4_LAS_BESTIAS_DEL_ESPACIO.md',
    hasFullText: true,
  },
  {
    id: 'hijo-invocador',
    slug: 'chapter-5',
    order: 5,
    status: 'canon',
    periodEs: 'Actualidad',
    periodEn: 'Present day',
    readingMinutes: 12,
    titleEs: 'El Hijo del Invocador',
    subtitleEs: 'El heredero de la catástrofe',
    summaryEs:
      'Un niño que ve números donde otros ven cansancio; un cuidador de cicatrices hexagonales; un padre que sostuvo el cielo y un nivel imposible: 78.',
    titleEn: "The Summoner's Heir",
    subtitleEn: 'Heir of the catastrophe',
    summaryEn:
      'A child who sees numbers where others see fatigue; a caretaker with hexagonal scars; a father who held the sky — and an impossible level: 78.',
    keysEs: ['Nivel 78', 'Cuidador', 'El invocador'],
    keysEn: ['Level 78', 'Caretaker', 'The summoner'],
    consequencesEs: 'El Hijo conoce su herencia; el mundo está a punto de pedirle cuentas.',
    consequencesEn: 'The Heir learns his inheritance; the world is about to hold him to account.',
    characters: ['El Hijo', 'El cuidador', 'El invocador (padre)'],
    factions: [],
    sourceFile: 'docs/lore/CAPITULO_5_EL_HIJO_DEL_INVOCADOR.md',
    hasFullText: true,
  },
  {
    id: 'ruptura-reinos',
    slug: 'chapter-6',
    order: 6,
    status: 'canon',
    periodEs: 'Post-caída',
    periodEn: 'Aftermath',
    readingMinutes: null,
    titleEs: 'La Ruptura de los Reinos',
    subtitleEs: 'Cuando la confianza cayó con el cielo',
    summaryEs:
      'La Miasma no se repartió de forma justa; el hambre y el miedo rompieron la cooperación y solo quedaron cuatro reinos.',
    titleEn: 'The Shattering of the Realms',
    subtitleEn: 'When trust fell with the sky',
    summaryEn:
      'The Miasma did not fall fairly; hunger and fear broke cooperation, and only four realms remained.',
    keysEs: ['Ruptura', 'Cuatro reinos', 'Economía regional'],
    keysEn: ['Shattering', 'Four realms', 'Regional economy'],
    consequencesEs: 'Fronteras como filtros; nace la economía de la escasez.',
    consequencesEn: 'Frontiers as filters; the scarcity economy is born.',
    characters: [],
    factions: [],
    sourceFile: 'docs/lore/CAPITULO_6_La RUPTURA_DE_LOS_REINOS.md',
    hasFullText: false,
  },
  {
    id: 'murallas-veneno',
    slug: 'chapter-7',
    order: 7,
    status: 'canon',
    periodEs: 'Post-ruptura',
    periodEn: 'After the shattering',
    readingMinutes: null,
    titleEs: 'Murallas y Veneno',
    subtitleEs: 'Dentro y fuera',
    summaryEs:
      'Por qué dentro de las murallas no aparecen bestias alteradas y fuera sí: piedra, símbolos y voluntades entrelazadas.',
    titleEn: 'Walls and Venom',
    subtitleEn: 'Inside and outside',
    summaryEn:
      'Why no altered beasts spawn inside the walls — and why they do outside: stone, symbols and interlaced wills.',
    keysEs: ['Murallas', 'Zonas seguras', 'Veneno'],
    keysEn: ['Walls', 'Safe zones', 'Venom'],
    consequencesEs: 'Dos mundos: el predecible tras los muros y el salvaje fuera.',
    consequencesEn: 'Two worlds: the predictable behind walls, the wild beyond.',
    characters: [],
    factions: [],
    sourceFile: 'docs/lore/CAPITULO_7_MURALLAS_Y_VENENO.md',
    hasFullText: false,
  },
  {
    id: 'dungeons-vivientes',
    slug: 'chapter-8',
    order: 8,
    status: 'canon',
    periodEs: 'Actualidad',
    periodEn: 'Present day',
    readingMinutes: null,
    titleEs: 'Las Dungeons Vivientes',
    subtitleEs: 'Estructuras que laten',
    summaryEs:
      'No eran cuevas, ni ruinas, ni trampas: las dungeons responden, susurran y mueren con su guardián final.',
    titleEn: 'The Living Dungeons',
    subtitleEn: 'Structures that breathe',
    summaryEn:
      'Not caves, ruins or traps: dungeons answer, whisper, and die with their final guardian.',
    keysEs: ['Dungeons', 'Guardianes', 'Distorsión'],
    keysEn: ['Dungeons', 'Guardians', 'Distortion'],
    consequencesEs: 'Las dungeons como riesgo útil: poder, riqueza o respuestas.',
    consequencesEn: 'Dungeons as useful risk: power, wealth or answers.',
    characters: [],
    factions: [],
    sourceFile: 'docs/lore/CAPITULO_8_LAS_DUNGEON_VIVIENTES.md',
    hasFullText: false,
  },
  {
    id: 'ecos-catastrofe',
    slug: 'chapter-9',
    order: 9,
    status: 'canon',
    periodEs: 'Actualidad',
    periodEn: 'Present day',
    readingMinutes: null,
    titleEs: 'Ecos de la Catástrofe',
    subtitleEs: 'Lo que los reinos no cuentan',
    summaryEs:
      'Versiones oficiales enfrentadas, registros ocultos y facciones de información: la verdad se filtra en fragmentos.',
    titleEn: 'Echoes of the Catastrophe',
    subtitleEn: 'What the realms do not tell',
    summaryEn:
      'Clashing official versions, hidden records and information factions: truth leaks in fragments.',
    keysEs: ['Registros', 'Facciones de información', 'Secretos'],
    keysEn: ['Records', 'Information factions', 'Secrets'],
    consequencesEs: 'Misiones de investigación; la DeathZone sigue observando.',
    consequencesEn: 'Investigation quests; the DeathZone keeps watching.',
    characters: ['Espías', 'Estudiosos'],
    factions: [],
    sourceFile: 'docs/lore/CAPITULO_9_ECOS_DE_LA_CATASTROFE.md',
    hasFullText: false,
  },
  {
    id: 'nino-nivel-78',
    slug: 'chapter-10',
    order: 10,
    status: 'canon',
    periodEs: 'Actualidad',
    periodEn: 'Present day',
    readingMinutes: null,
    titleEs: 'El Niño del Nivel 78',
    subtitleEs: 'La entrada al sistema',
    summaryEs:
      'La medición en la academia, el cristal que cantó y la despedida del cuidador: la Temporada 1 cierra y el Hijo empieza a caminar.',
    titleEn: 'The Level 78 Child',
    subtitleEn: 'Entering the system',
    summaryEn:
      'The measuring at the academy, the crystal that sang, and the caretaker farewell: Season 1 closes as the Heir starts walking.',
    keysEs: ['Medición', 'Vigilancia', 'Despedida'],
    keysEn: ['Measuring', 'Surveillance', 'Farewell'],
    consequencesEs: 'El Hijo queda registrado y vigilado; la Temporada 2 lo recibirá visible.',
    consequencesEn: 'The Heir is registered and watched; Season 2 will receive him in the open.',
    characters: ['El Hijo', 'El cuidador', 'Hombre de ropas grises'],
    factions: [],
    sourceFile: 'docs/lore/CAPITULO_10_EL_NINO_DEL_NIVEL_78.md',
    hasFullText: false,
  },
];

export function getChapter(slug: string) {
  return chapters.find((c) => c.slug === slug);
}

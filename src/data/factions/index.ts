/**
 * Factions Data Layer - DeathEmpire
 * Fuente: docs/game-design/ECONOMY_AND_TRANSPORT.md, docs/lore/*.md
 * Capa de datos local para facciones, organizaciones y grupos de poder.
 */

export interface Faction {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  motto?: string;
  symbol?: string;
  colors: { primary: string; secondary: string; accent: string };
  type: 'politica' | 'militar' | 'religiosa' | 'comercial' | 'academica' | 'criminal' | 'sobrevivientes' | 'cazadores' | 'inquisicion' | 'bestias';
  alignment: 'lawful-good' | 'lawful-neutral' | 'lawful-evil' | 'neutral-good' | 'true-neutral' | 'neutral-evil' | 'chaotic-good' | 'chaotic-neutral' | 'chaotic-evil';
  status: 'activa' | 'fragmentada' | 'declinante' | 'extinta' | 'secreta' | 'en-guerra';
  territory?: string[];
  headquarters?: string;
  leader?: string;
  notableMembers: string[];
  allies: string[];
  enemies: string[];
  resources: string[];
  goals: string[];
  philosophy: string;
  publicKnowledge: 'conocida' | 'rumor' | 'secreta' | 'mitica';
  status_dev: 'documented' | 'development' | 'concept';
  relatedChapters: string[];
  relatedCharacters: string[];
  relatedLocations: string[];
}

export const factions: Faction[] = [
  {
    id: 'inquisicion',
    name: 'La Inquisición del Maná',
    shortName: 'Inquisición',
    description: 'Organización militar-religiosa fundada tras el Despertar. Su mandato: contener, estudiar y erradicar la Corrupción. Opera con autoridad cuasi-imperial en territorios controlados.',
    motto: 'El Maná sirve. El caos arde.',
    symbol: 'ojo-llameante',
    colors: { primary: '#8b1a1a', secondary: '#1a0a0a', accent: '#d45d2e' },
    type: 'inquisicion',
    alignment: 'lawful-neutral',
    status: 'activa',
    territory: ['bastiones-inquisicion', 'zonas-cuarentena', 'torres-selladas'],
    headquarters: 'Bastión de la Purga (ruinas de la Capital Imperial)',
    leader: 'Gran Inquisidor Varekh',
    notableMembers: ['Varekh', 'Inquisidor Kaelen', 'Purificadora Mara', 'Archivo Silencioso'],
    allies: ['legiones-remanentes', 'cazadores-estelares', 'gremio-artesanos'],
    enemies: ['culto-mana', 'bestias-espacio', 'corruptos', 'herejes'],
    resources: ['fragmentos-estelares', 'armamento-bendito', 'archivos-antiguos', 'reclutas'],
    goals: ['Contener la Corrupción', 'Sellar grietas de Maná', 'Cazar corruptos', 'Preservar humanidad'],
    philosophy: 'El orden a cualquier costo. La misericordia es debilidad ante la Corrupción.',
    publicKnowledge: 'conocida',
    status_dev: 'documented',
    relatedChapters: ['despertar-mana', 'cielo-cayo', 'bestias-espacio'],
    relatedCharacters: ['gran-inquisidor-varekh', 'inquisidor-kaelen'],
    relatedLocations: ['bastion-purga', 'torres-selladas', 'zonas-cuarentena'],
  },
  {
    id: 'cazadores-estelares',
    name: 'Cazadores Estelares',
    shortName: 'Cazadores',
    description: 'Orden marcial especializada en rastrear, combatir y estudiar a las Bestias del Espacio. Usan armas forjadas con Fragmentos Estelares. Son los únicos que pueden matar permanentemente a un Alfa.',
    motto: 'El cielo cayó. Nosotros cazamos lo que trajo.',
    symbol: 'estrella-roja',
    colors: { primary: '#2d5a8a', secondary: '#0d1a2a', accent: '#e87a4a' },
    type: 'cazadores',
    alignment: 'chaotic-good',
    status: 'activa',
    territory: ['crateres-estelares', 'fronteras-salvajes', 'torres-vigia'],
    headquarters: 'Fortaleza Estrella (cráter principal)',
    leader: 'Maestra Cazadora Lyra',
    notableMembers: ['Lyra', 'Veterano Korr', 'Rastreadora Sable', 'Forjador Vex'],
    allies: ['inquisicion', 'legiones-remanentes', 'supervivientes-libres'],
    enemies: ['bestias-espacio', 'alfa-primordial', 'culto-mana'],
    resources: ['fragmentos-estelares', 'armas-estrella', 'bestias-estudiadas', 'mapas-caidas'],
    goals: ['Matar Alfas', 'Estudiar bestias', 'Proteger civiles', 'Encontrar origen fragmentos'],
    philosophy: 'Cada bestia muerta es un mundo salvado. La ciencia sirve a la supervivencia.',
    publicKnowledge: 'conocida',
    status_dev: 'documented',
    relatedChapters: ['cielo-cayo', 'bestias-espacio', 'hijo-invocador'],
    relatedCharacters: ['maestra-lyra', 'el-hijo-invocador'],
    relatedLocations: ['fortaleza-estrella', 'crateres', 'forjas-estrella'],
  },
  {
    id: 'legiones-remanentes',
    name: 'Legiones Remanentes del Imperio',
    shortName: 'Legiones',
    description: 'Fragmentos del ejército imperial que mantienen estructura y lealtad. Defienden bastiones, escoltan caravanas y mantienen el orden donde la Inquisición no llega.',
    motto: 'El Imperio no ha caído. Solo espera.',
    symbol: 'aguila-dorada',
    colors: { primary: '#c9a86b', secondary: '#1a1814', accent: '#8b1a1a' },
    type: 'militar',
    alignment: 'lawful-good',
    status: 'fragmentada',
    territory: ['bastiones-fronterizos', 'rutas-caravanas', 'ciudades-refugio'],
    headquarters: 'Bastión Valoria (norte)',
    leader: 'General Marcus Valen',
    notableMembers: ['Marcus Valen', 'Centurión Darius', 'Médica Elara', 'Ingeniero Torin'],
    allies: ['inquisicion', 'cazadores-estelares', 'gremio-artesanos', 'supervivientes'],
    enemies: ['bandidos', 'culto-mana', 'bestias-espacio', 'separatistas'],
    resources: ['armamento-imperial', 'murallas', 'suministros', 'reclutas-leales'],
    goals: ['Mantener orden', 'Proteger civiles', 'Restaurar rutas', 'Esperar al Heredero'],
    philosophy: 'Deber sobre gloria. El escudo que no se rompe.',
    publicKnowledge: 'conocida',
    status_dev: 'documented',
    relatedChapters: ['era-esplendor', 'despertar-mana'],
    relatedCharacters: ['general-valen', 'centurion-darius'],
    relatedLocations: ['bastion-valoria', 'rutas-caravanas', 'ciudades-refugio'],
  },
  {
    id: 'culto-mana',
    name: 'Culto del Maná Salvaje',
    shortName: 'Culto',
    description: 'Secta que venera el Maná salvaje como divinidad. Buscan la Corrupción voluntaria. Creen que el Despertar fue una ascensión, no una catástrofe. Peligrosos, impredecibles, infiltrados.',
    motto: 'El caos es libertad. El Maná es dios.',
    symbol: 'espiral-rota',
    colors: { primary: '#4a1a4a', secondary: '#0d050d', accent: '#d45d2e' },
    type: 'religiosa',
    alignment: 'chaotic-evil',
    status: 'secreta',
    territory: ['zonas-corruptas', 'túneles-olvidados', 'infiltración-ciudades'],
    headquarters: 'Desconocido (rumorado: Corazón de la Corrupción)',
    leader: 'El Susurrante (identidad desconocida)',
    notableMembers: ['El Susurrante', 'Portadores de la Mancha', 'Infiltrados'],
    allies: ['bestias-espacio (tácito)', 'corruptos'],
    enemies: ['inquisicion', 'cazadores-estelares', 'legiones', 'civilización'],
    resources: ['maná-corrupto', 'información', 'seguidores', 'rituales'],
    goals: ['Expandir Corrupción', 'Despertar Alfas', 'Destruir sellos', 'Traer el Caos Total'],
    philosophy: 'El orden es mentira. Solo el Maná libre es verdad. Ardan los que se resisten.',
    publicKnowledge: 'rumor',
    status_dev: 'development',
    relatedChapters: ['despertar-mana', 'cielo-cayo', 'bestias-espacio'],
    relatedCharacters: ['el-susurrante'],
    relatedLocations: ['corazon-corrupcion', 'tuneles-olvidados', 'altares-ocultos'],
  },
  {
    id: 'gremio-artesanos',
    name: 'Gremio de Artesanos y Forjadores',
    shortName: 'Gremio',
    description: 'Herederos de la tradición técnica imperial. Forjan armas de Fragmentos Estelares, mantienen infraestructura, comercian tecnología. Neutrales pero esenciales.',
    motto: 'El acero no elige bando. Nosotros sí.',
    symbol: 'martillo-yunque',
    colors: { primary: '#5a4d3d', secondary: '#1a1612', accent: '#c9a86b' },
    type: 'comercial',
    alignment: 'true-neutral',
    status: 'activa',
    territory: ['ciudades-mercado', 'forjas-estelares', 'rutas-comerciales'],
    headquarters: 'Ciudad-Fragua Ironhold',
    leader: 'Maestra Forjadora Brynn',
    notableMembers: ['Brynn', 'Forjador Vex', 'Comerciante Hale', 'Ingeniera Mina'],
    allies: ['legiones', 'inquisicion', 'cazadores', 'supervivientes'],
    enemies: ['bandidos', 'culto-mana', 'monopolios-corruptos'],
    resources: ['fragmentos-estelares', 'tecnología-imperial', 'red-comercial', 'conocimiento-antiguo'],
    goals: ['Mantener comercio', 'Forjar armas estelares', 'Preservar conocimiento', 'Independencia'],
    philosophy: 'El mejor arma no mata. Permite elegir.',
    publicKnowledge: 'conocida',
    status_dev: 'documented',
    relatedChapters: ['era-esplendor', 'cielo-cayo'],
    relatedCharacters: ['maestra-brynn', 'forjador-vex'],
    relatedLocations: ['ironhold', 'forjas-estrella', 'rutas-comerciales'],
  },
  {
    id: 'supervivientes-libres',
    name: 'Supervivientes Libres / Asentamientos Independientes',
    shortName: 'Libres',
    description: 'Comunidades que rechazan autoridad central. Autosuficientes, móviles, pragmáticas. Refugio para los que no encajan en facciones mayores.',
    motto: 'Nadie nos dice cómo vivir. Solo cómo morir.',
    symbol: 'bandera-rota',
    colors: { primary: '#4a4540', secondary: '#1a1816', accent: '#8a8275' },
    type: 'sobrevivientes',
    alignment: 'chaotic-neutral',
    status: 'fragmentada',
    territory: ['pueblos-libres', 'caravanas-nómadas', 'ruinas-adaptadas'],
    headquarters: 'Ninguno (red descentralizada)',
    leader: 'Consejo de Ancianos (rotativo)',
    notableMembers: ['Anciana Oria', 'Caravanero Jace', 'Médico Tavin', 'Exploradora Kipp'],
    allies: ['gremio', 'legiones (ocasional)', 'cazadores (ocasional)'],
    enemies: ['inquisicion (reclutamiento forzado)', 'culto', 'bandidos', 'bestias'],
    resources: ['conocimiento-local', 'rutas-seguras', 'artesanía-práctica', 'información'],
    goals: ['Sobrevivir', 'Autonomía', 'Ayudar prójimos', 'Evitar guerra'],
    philosophy: 'La libertad cuesta caro. Vale la pena.',
    publicKnowledge: 'conocida',
    status_dev: 'documented',
    relatedChapters: ['despertar-mana', 'cielo-cayo'],
    relatedCharacters: ['anciana-oria', 'caravanero-jace'],
    relatedLocations: ['pueblos-libres', 'caravanas', 'ruinas-vivas'],
  },
  {
    id: 'bestias-espacio-faccion',
    name: 'Enjambre de las Bestias del Espacio',
    shortName: 'El Enjambre',
    description: 'No una facción en sentido humano. Inteligencia colectiva de las Bestias. Coordinadas por Alfas. Objetivo: expandir Corrupción, consumir, adaptar.',
    motto: '(No tienen lenguaje. Solo Hambre.)',
    symbol: 'garra-vacia',
    colors: { primary: '#1a0a0a', secondary: '#050505', accent: '#d45d2e' },
    type: 'bestias',
    alignment: 'neutral-evil',
    status: 'activa',
    territory: ['territorios-corruptos', 'crateres', 'zonas-exclusion'],
    headquarters: 'Nido Primordial (ubicación desconocida)',
    leader: 'Alfa Primordial / La Bestia Primera',
    notableMembers: ['Alfa Primordial', 'Alfas Secundarios', 'Manadas', 'Drones'],
    allies: ['culto-mana (tácito)', 'corruptos'],
    enemies: ['todo lo vivo no corrupto'],
    resources: ['biomasa', 'maná-corrupto', 'fragmentos', 'adaptación-genética'],
    goals: ['Expandir Corrupción', 'Consumir civilización', 'Evolucionar', 'Llamar a más del Vacío'],
    philosophy: 'Existencia = Expansión. Resistencia = Alimento.',
    publicKnowledge: 'conocida',
    status_dev: 'documented',
    relatedChapters: ['cielo-cayo', 'bestias-espacio'],
    relatedCharacters: ['alfa-primordial'],
    relatedLocations: ['nido-primordial', 'territorios-corruptos', 'crateres'],
  },
];

// Utilidades
export function getFactionById(id: string) {
  return factions.find(f => f.id === id);
}

export function getFactionsByType(type: Faction['type']) {
  return factions.filter(f => f.type === type);
}

export function getFactionsByStatus(status: Faction['status']) {
  return factions.filter(f => f.status === status);
}

export function getAlliedFactions(factionId: string) {
  const faction = getFactionById(factionId);
  if (!faction) return [];
  return factions.filter(f => faction.allies.includes(f.id));
}

export function getEnemyFactions(factionId: string) {
  const faction = getFactionById(factionId);
  if (!faction) return [];
  return factions.filter(f => faction.enemies.includes(f.id));
}

export const factionsMetadata = {
  total: factions.length,
  active: factions.filter(f => f.status === 'activa').length,
  documented: factions.filter(f => f.status_dev === 'documented').length,
  development: factions.filter(f => f.status_dev === 'development').length,
  lastUpdated: '2026-10-01',
  source: 'docs/lore/*, docs/game-design/ECONOMY_AND_TRANSPORT.md',
};
/**
 * Lore Data Layer - DeathEmpire
 * Fuente: docs/lore/*.md
 * Capa de datos local separada de la interfaz.
 * Prepara interfaz futura para API sin implementar fetch remoto.
 */

export interface LoreChapter {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  status: 'canon' | 'development' | 'concept' | 'hypothesis';
  order: number;
  keywords: string[];
  relatedCharacters: string[];
  relatedLocations: string[];
  relatedFactions: string[];
}

export interface LoreEra {
  id: string;
  name: string;
  description: string;
  startEvent?: string;
  endEvent?: string;
  keyEvents: string[];
  chapters: string[];
  status: 'documented' | 'in-development' | 'concept';
}

export interface LoreCharacter {
  id: string;
  name: string;
  titles: string[];
  faction?: string;
  kingdom?: string;
  status: 'alive' | 'deceased' | 'missing' | 'unknown';
  role: 'protagonist' | 'antagonist' | 'supporting' | 'historical' | 'mythical';
  description: string;
  aliases: string[];
  firstAppearance: string;
  relatedEvents: string[];
}

export interface LoreConcept {
  id: string;
  name: string;
  category: 'magic' | 'technology' | 'history' | 'geography' | 'metaphysics' | 'mechanics';
  description: string;
  status: 'documented' | 'theorized' | 'legend' | 'development';
  relatedChapters: string[];
  relatedEntities: string[];
}

// Capítulos del Lore - Basados en docs/lore/CAPITULO_*.md
export const loreChapters: LoreChapter[] = [
  {
    id: 'era-esplendor',
    title: 'La Era del Esplendor',
    subtitle: 'El apogeo antes de la caída',
    summary: 'La edad dorada de la civilización antes del Despertar del Maná. Imperios florecientes, magia controlada, tecnología y paz relativa.',
    status: 'canon',
    order: 1,
    keywords: ['imperio', 'magia controlada', 'paz', 'tecnología antigua', 'pre-cataclismo'],
    relatedCharacters: ['el-invocador', 'los-archimagos'],
    relatedLocations: ['capital-imperial', 'torres-de-mana', 'ciudades-flotantes'],
    relatedFactions: ['orden-de-los-sabios', 'gremio-artesanos', 'legiones-imperiales'],
  },
  {
    id: 'despertar-mana',
    title: 'El Despertar del Maná',
    subtitle: 'Cuando la magia dejó de obedecer',
    summary: 'El evento cataclísmico que rompió el control de la magia. El Maná salvaje inundó el mundo, transformando la realidad y destruyendo imperios.',
    status: 'canon',
    order: 2,
    keywords: ['cataclismo', 'mana salvaje', 'mutaciones', 'caída-imperios', 'punto-de-inflexión'],
    relatedCharacters: ['el-invocador', 'los-archimagos', 'la-bestia-primera'],
    relatedLocations: ['epicentro-despertar', 'ruinas-capital', 'zonas-contaminadas'],
    relatedFactions: ['supervivientes', 'culto-mana', 'inquisicion'],
  },
  {
    id: 'cielo-cayo',
    title: 'El Cielo Que Cayó',
    subtitle: 'Los fragmentos estelares y las bestias del espacio',
    summary: 'Fragmentos de algo antiguo cayeron del cielo. No eran meteoritos. Trajeron criaturas que no pertenecen a este mundo.',
    status: 'canon',
    order: 3,
    keywords: ['fragmentos-estelares', 'bestias-espaciales', 'metal-vivo', 'corrupción', 'cazadores'],
    relatedCharacters: ['el-hijo-invocador', 'cazadores-estelares', 'bestias-alfa'],
    relatedLocations: ['crateres-estelares', 'zonas-de-caída', 'fortalezas-cazadores'],
    relatedFactions: ['cazadores-estelares', 'inquisicion', 'legiones-rotas'],
  },
  {
    id: 'bestias-espacio',
    title: 'Las Bestias del Espacio',
    subtitle: 'Ecología de lo que no debería existir',
    summary: 'Estudio de las criaturas llegadas del vacío. Su biología, comportamiento, jerarquía y la amenaza que representan para lo que queda de civilización.',
    status: 'development',
    order: 4,
    keywords: ['xeno-biología', 'jerarquía-bestias', 'alfa', 'corrupción-maná', 'adaptación'],
    relatedCharacters: ['bestias-alfa', 'cazadores-veteranos', 'biólogos-locos'],
    relatedLocations: ['nidos-bestias', 'territorios-corruptos', 'zonas-exclusión'],
    relatedFactions: ['cazadores-estelares', 'inquisicion', 'gremio-estudiosos'],
  },
  {
    id: 'hijo-invocador',
    title: 'El Hijo del Invocador',
    subtitle: 'El heredero de la catástrofe',
    summary: 'La figura central del conflicto actual. Hijo del arquitecto del Despertar, portador de un poder que podría salvar o terminar el mundo.',
    status: 'development',
    order: 5,
    keywords: ['linaje', 'herencia-maldita', 'elección', 'redención-o-destrucción', 'profecía'],
    relatedCharacters: ['el-invocador', 'compañeros', 'enemigos', 'mentores'],
    relatedLocations: ['lugar-nacimiento', 'santuarios', 'campos-batalla', 'torres-selladas'],
    relatedFactions: ['todas', 'neutro', 'clave-narrativa'],
  },
];

// Eras históricas
export const loreEras: LoreEra[] = [
  {
    id: 'era-antigua',
    name: 'Era Antigua / Pre-Esplendor',
    description: 'Tiempos míticos antes de los registros escritos. Solo leyendas y ruinas.',
    keyEvents: ['Primeros asentamientos', 'Descubrimiento del Maná', 'Guerras tribales'],
    chapters: [],
    status: 'concept',
  },
  {
    id: 'era-esplendor',
    name: 'Era del Esplendor',
    description: 'Apogeo de la civilización. Magia y tecnología en armonía. Paz de mil años.',
    startEvent: 'Fundación del Imperio Unificado',
    endEvent: 'El Despertar del Maná',
    keyEvents: ['Construcción de Torres de Maná', 'Ciudades flotantes', 'Gremios universales', 'Pax Imperial'],
    chapters: ['era-esplendor'],
    status: 'documented',
  },
  {
    id: 'era-caos',
    name: 'Era del Caos / Post-Despertar',
    description: 'El mundo roto. Supervivencia, facciones en guerra, magia incontrolable.',
    startEvent: 'El Despertar del Maná',
    endEvent: 'La Caída del Cielo',
    keyEvents: ['Colapso imperial', 'Nacimiento de facciones', 'Primeras bestias', 'Inquisición fundada'],
    chapters: ['despertar-mana'],
    status: 'documented',
  },
  {
    id: 'era-estelar',
    name: 'Era Estelar / Actual',
    description: 'Fragmentos del cielo caen. Bestias del espacio. El Hijo del Invocador camina.',
    startEvent: 'La Caída del Cielo',
    keyEvents: ['Primer impacto estelar', 'Cazadores organizados', 'Apariencia del Hijo', 'Guerra de tres frentes'],
    chapters: ['cielo-cayo', 'bestias-espacio', 'hijo-invocador'],
    status: 'in-development',
  },
];

// Personajes principales
export const loreCharacters: LoreCharacter[] = [
  {
    id: 'el-invocador',
    name: 'El Invocador',
    titles: ['Arquitecto del Despertar', 'Padre de la Catástrofe', 'Ex-Archimago Supremo'],
    faction: 'ninguna (fallecido)',
    kingdom: 'Imperio Caído',
    status: 'deceased',
    role: 'antagonist',
    description: 'El mago más poderoso de la Era del Esplendor. Buscó trascender los límites del Maná y rompió el mundo. Su legado es la ruina.',
    aliases: ['El Arquitecto', 'El Que Rompió el Mundo', 'Padre del Hijo'],
    firstAppearance: 'era-esplendor',
    relatedEvents: ['despertar-mana', 'fundacion-torres', 'experimento-final'],
  },
  {
    id: 'el-hijo-invocador',
    name: 'El Hijo del Invocador',
    titles: ['Heredero Maldito', 'Portador del Alba', 'Caminante Entre Mundos'],
    faction: 'independiente',
    kingdom: 'ninguno (nómada)',
    status: 'alive',
    role: 'protagonist',
    description: 'Hijo del arquitecto de la catástrofe. Porta en su sangre el Maná salvaje y la llave para sellar o abrir las grietas. Su camino define el final.',
    aliases: ['El Heredero', 'El Que Camina', 'Hijo de la Ruina'],
    firstAppearance: 'hijo-invocador',
    relatedEvents: ['nacimiento-oculto', 'descubrimiento-poder', 'primer-sello', 'enfrentamiento-bestia-alfa'],
  },
  {
    id: 'la-bestia-primera',
    name: 'La Bestia Primera / Alfa Primordial',
    titles: ['Madre de la Manada', 'Voz del Vacío', 'La Que No Muere'],
    faction: 'bestias-del-espacio',
    kingdom: 'territorios-corruptos',
    status: 'alive',
    role: 'antagonist',
    description: 'La primera bestia en caer del cielo. La más grande, la más inteligente. Comanda a las otras. Su mente es un enjambre.',
    aliases: ['Alfa', 'La Madre', 'Esa-Cosa'],
    firstAppearance: 'cielo-cayo',
    relatedEvents: ['primer-impacto', 'nacimiento-manada', 'asalto-fortaleza-cazadores'],
  },
];

// Conceptos fundamentales
export const loreConcepts: LoreConcept[] = [
  {
    id: 'mana',
    name: 'Maná / La Corriente',
    category: 'magic',
    description: 'La energía fundamental que subyace a la realidad. En la Era del Esplendor fue domesticada. Tras el Despertar, se volvió salvaje, mutagénica e impredecible.',
    status: 'documented',
    relatedChapters: ['era-esplendor', 'despertar-mana', 'cielo-cayo'],
    relatedEntities: ['torres-mana', 'invocador', 'bestias', 'hijo-invocador'],
  },
  {
    id: 'torres-mana',
    name: 'Torres de Maná / Pilares del Mundo',
    category: 'technology',
    description: 'Estructuras masivas construidas en la Era del Esplendor para canalizar, estabilizar y distribuir Maná. La mayoría cayeron o se corrompieron.',
    status: 'documented',
    relatedChapters: ['era-esplendor', 'despertar-mana'],
    relatedEntities: ['invocador', 'archimagos', 'ciudades-flotantes'],
  },
  {
    id: 'fragmentos-estelares',
    name: 'Fragmentos Estelares / Metal Vivo',
    category: 'metaphysics',
    description: 'Objetos caídos del cielo. No son minerales. Reaccionan al Maná, "crecen", pueden usarse para forjar armas que dañan a las bestias. Su origen es desconocido.',
    status: 'theorized',
    relatedChapters: ['cielo-cayo', 'bestias-espacio'],
    relatedEntities: ['bestias', 'cazadores', 'forjas-especiales', 'hijo-invocador'],
  },
  {
    id: 'corrupcion',
    name: 'Corrupción / La Mancha',
    category: 'metaphysics',
    description: 'Proceso por el cual el Maná salvaje transforma materia viva. No es enfermedad: es reescritura biológica forzada. Irreversible en etapas avanzadas.',
    status: 'documented',
    relatedChapters: ['despertar-mana', 'cielo-cayo', 'bestias-espacio'],
    relatedEntities: ['mana', 'bestias', 'zonas-contaminadas', 'inquisicion'],
  },
  {
    id: 'ciclo-diario-30min',
    name: 'Ciclo Diario de 30 Minutos (36000 ticks)',
    category: 'mechanics',
    description: 'El día en DeathEmpire dura 30 minutos reales (36000 ticks). Nocturnidad más peligrosa, fenología alterada, economía adaptada.',
    status: 'documented',
    relatedChapters: [],
    relatedEntities: ['gameplay', 'phantom-spawner', 'economia', 'aldeanos'],
  },
];

// Utilidades de acceso a datos
export function getChapterById(id: string): LoreChapter | undefined {
  return loreChapters.find(c => c.id === id);
}

export function getChaptersByStatus(status: LoreChapter['status']): LoreChapter[] {
  return loreChapters.filter(c => c.status === status);
}

export function getChaptersInOrder(): LoreChapter[] {
  return [...loreChapters].sort((a, b) => a.order - b.order);
}

export function getEraById(id: string): LoreEra | undefined {
  return loreEras.find(e => e.id === id);
}

export function getCharacterById(id: string): LoreCharacter | undefined {
  return loreCharacters.find(c => c.id === id);
}

export function getConceptById(id: string): LoreConcept | undefined {
  return loreConcepts.find(c => c.id === id);
}

export function getConceptsByCategory(category: LoreConcept['category']): LoreConcept[] {
  return loreConcepts.filter(c => c.category === category);
}

// Metadata para SEO y navegación
export const loreMetadata = {
  totalChapters: loreChapters.length,
  canonChapters: loreChapters.filter(c => c.status === 'canon').length,
  developmentChapters: loreChapters.filter(c => c.status === 'development').length,
  totalCharacters: loreCharacters.length,
  totalConcepts: loreConcepts.length,
  lastUpdated: '2026-10-01',
  source: 'docs/lore/*.md',
};
/**
 * Lore Reactions - Catálogo Único EN/ES
 * Definición canónica de las 4 reacciones temáticas del Libro del Lore.
 * Fuente única de verdad para etiquetas, emojis, descripciones y orden.
 * Usado por: UI, contadores, validación, documentación.
 */

import type { LoreReactionCatalogEntry } from '../../types/lore-reactions';

/**
 * Catálogo maestro de reacciones (orden = prioridad visual).
 * Cada entrada tiene todo lo necesario para EN/ES.
 * No modificar sin ruling de canon.
 */
export const LORE_REACTION_CATALOG: readonly LoreReactionCatalogEntry[] = [
  {
    kind: 'imperial_loyalty',
    emoji: '⚔',
    labelEN: 'Imperial Loyalty',
    labelES: 'Lealtad Imperial',
    descriptionEN: 'Pledge allegiance to the Empire and its eternal order.',
    descriptionES: 'Jura lealtad al Imperio y a su orden eterno.',
    order: 1,
  },
  {
    kind: 'mana_corruption',
    emoji: '🔮',
    labelEN: 'Mana Corruption',
    labelES: 'Corrupción de Maná',
    descriptionEN: 'The wild power twists reality — beautiful and terrible.',
    descriptionES: 'El poder salvaje retuerce la realidad — hermosa y terrible.',
    order: 2,
  },
  {
    kind: 'inquisitorial_alert',
    emoji: '👁',
    labelEN: 'Inquisitorial Alert',
    labelES: 'Alerta Inquisitorial',
    descriptionEN: 'The Inquisition watches. Heresy will be purged.',
    descriptionES: 'La Inquisición vigila. La herejía será purgada.',
    order: 3,
  },
  {
    kind: 'consumed_by_void',
    emoji: '💀',
    labelEN: 'Consumed by the Void',
    labelES: 'Consumido por el Vacío',
    descriptionEN: 'The Miasma claims another soul. Nothing returns.',
    descriptionES: 'La Miasma reclama otra alma. Nada regresa.',
    order: 4,
  },
] as const;

/**
 * Obtiene una entrada del catálogo por kind.
 * Retorna undefined si el kind no es válido.
 */
export function getReactionCatalogEntry(kind: string): typeof LORE_REACTION_CATALOG[0] | undefined {
  return LORE_REACTION_CATALOG.find(entry => entry.kind === kind);
}

/**
 * Obtiene la etiqueta localizada para un kind.
 */
export function getReactionLabel(kind: string, lang: 'en' | 'es'): string {
  const entry = getReactionCatalogEntry(kind);
  if (!entry) return kind;
  return lang === 'es' ? entry.labelES : entry.labelEN;
}

/**
 * Obtiene la descripción localizada para un kind.
 */
export function getReactionDescription(kind: string, lang: 'en' | 'es'): string {
  const entry = getReactionCatalogEntry(kind);
  if (!entry) return '';
  return lang === 'es' ? entry.descriptionES : entry.descriptionEN;
}

/**
 * Obtiene el emoji para un kind.
 */
export function getReactionEmoji(kind: string): string {
  const entry = getReactionCatalogEntry(kind);
  return entry?.emoji ?? '❓';
}

/**
 * Obtiene todos los kinds válidos en orden.
 */
export function getOrderedReactionKinds(): readonly string[] {
  return LORE_REACTION_CATALOG.map(entry => entry.kind);
}

/**
 * Obtiene el catálogo completo para un idioma.
 * Útil para renderizar listas completas (ej. UI de reacciones).
 */
export function getFullReactionCatalog(lang: 'en' | 'es'): Array<{
  kind: string;
  emoji: string;
  label: string;
  description: string;
  order: number;
}> {
  return LORE_REACTION_CATALOG.map(entry => ({
    kind: entry.kind,
    emoji: entry.emoji,
    label: lang === 'es' ? entry.labelES : entry.labelEN,
    description: lang === 'es' ? entry.descriptionES : entry.descriptionEN,
    order: entry.order,
  }));
}

/**
 * Verifica si un kind es válido (type guard).
 */
export function isValidReactionKind(kind: string): kind is typeof LORE_REACTION_CATALOG[0]['kind'] {
  return LORE_REACTION_CATALOG.some(entry => entry.kind === kind);
}

/**
 * Obtiene contadores por defecto (todos a 0) con keys del catálogo.
 * Útil para inicialización de estado UI.
 */
export function getDefaultReactionCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of LORE_REACTION_CATALOG) {
    counts[entry.kind] = 0;
  }
  return counts;
}
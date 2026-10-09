/**
 * Lore Reactions - Type Definitions
 * Contratos para reacciones temáticas del Libro del Lore (Fase 1 - Fundación)
 * Sin dependencias de Supabase; lista para tree-shaking en build.
 */

export type LoreReactionKind =
  | 'imperial_loyalty'
  | 'mana_corruption'
  | 'inquisitorial_alert'
  | 'consumed_by_void';

export const LORE_REACTION_KINDS: readonly LoreReactionKind[] = [
  'imperial_loyalty',
  'mana_corruption',
  'inquisitorial_alert',
  'consumed_by_void',
] as const;

export interface LoreReactionLabels {
  emoji: string;
  label: string;
  description: string;
}

export interface LoreReactionCatalogEntry {
  kind: LoreReactionKind;
  emoji: string;
  labelEN: string;
  labelES: string;
  descriptionEN: string;
  descriptionES: string;
  order: number;
}

export interface LoreReactionCounts {
  [kind: string]: number;
}

export interface LoreReactionPayload {
  chapter_id: string;
  kind: LoreReactionKind;
  user_hash: string;
  idempotency_key: string;
}

export interface LoreReactionSubmitResult {
  success: boolean;
  counts?: LoreReactionCounts;
  error?: string;
  retryAfter?: number;
}

export type LoreReactionAvailability =
  | { available: true; service: 'supabase'; reason: string; serviceType: 'fallback' | 'supabase' | 'mock' }
  | { available: false; reason: 'unconfigured' | 'unavailable' | 'maintenance' };

/**
 * Interfaz del servicio de reacciones (para inyección de dependencias / factory)
 * Implementaciones: UnavailableLoreReactionService (fallback), SupabaseLoreReactionService (futura)
 */
export interface LoreReactionService {
  readonly isAvailable: boolean;
  readonly availability: LoreReactionAvailability;

  getCounts(chapterSlug: string): Promise<LoreReactionCounts>;
  submitReaction(payload: LoreReactionPayload): Promise<LoreReactionSubmitResult>;
}

export function isValidLoreReactionKind(kind: string): kind is LoreReactionKind {
  return LORE_REACTION_KINDS.includes(kind as LoreReactionKind);
}

export function getDefaultCounts(): LoreReactionCounts {
  return {
    imperial_loyalty: 0,
    mana_corruption: 0,
    inquisitorial_alert: 0,
    consumed_by_void: 0,
  };
}
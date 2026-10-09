/**
 * Lore Reactions - Fallback Service
 * Implementación "unavailable" usada cuando no hay configuración Supabase válida.
 * Cero dependencias externas, cero client JS, tree-shakeable.
 *
 * Estado: "unavailable" - usado en Fase 1 (fundación) y como fallback seguro.
 */

import type {
  LoreReactionCounts,
  LoreReactionPayload,
  LoreReactionSubmitResult,
  LoreReactionAvailability,
  LoreReactionKind,
} from '@deathempire/types/lore-reactions';
import type { LoreReactionServiceContract } from './contracts';
import { getDefaultCounts, isValidLoreReactionKind } from '@deathempire/types/lore-reactions';
import { LoreReactionErrorCodes, createLoreReactionError } from './contracts';

/**
 * Servicio de reacciones no disponible.
 * Usado cuando no hay configuración Supabase válida o en modo mantenimiento.
 * No realiza llamadas de red, no expone secretos, no almacena estado.
 */
export class UnavailableLoreReactionService implements LoreReactionServiceContract {
  readonly isAvailable = false;
  readonly availability: LoreReactionAvailability = {
    available: false,
    reason: 'unconfigured',
  };

  async getCounts(_chapterSlug: string): Promise<LoreReactionCounts> {
    // Siempre retorna ceros - sin backend, no hay contadores reales
    return getDefaultCounts();
  }

  async submitReaction(payload: {
    chapter_id: string;
    kind: string;
    user_hash: string;
    idempotency_key: string;
  }): Promise<{ success: boolean; error?: string }> {
    // Validación básica de entrada (defensa en profundidad)
    if (!payload.chapter_id || typeof payload.chapter_id !== 'string') {
      return {
        success: false,
        error: 'Invalid chapter slug',
      };
    }

    if (!payload.kind || typeof payload.kind !== 'string') {
      return {
        success: false,
        error: 'Invalid reaction kind',
      };
    }

    if (!payload.idempotency_key || typeof payload.idempotency_key !== 'string') {
      return {
        success: false,
        error: 'Missing idempotency key',
      };
    }

    // Servicio no disponible - error controlado
    return {
      success: false,
      error: 'Reactions service is not configured. Please configure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY to enable reactions.',
    };
  }
}

/**
 * Instancia singleton del servicio no disponible.
 * Tree-shakeable: si se usa Supabase real, este código se elimina en build.
 */
export const unavailableLoreReactionService = new UnavailableLoreReactionService();

/**
 * Factory function para obtener el servicio de fallback.
 * Permite testing e inyección de dependencias.
 */
export function createUnavailableLoreReactionService(): UnavailableLoreReactionService {
  return new UnavailableLoreReactionService();
}
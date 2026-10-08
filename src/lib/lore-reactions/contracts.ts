/**
 * Lore Reactions - Service Contracts
 * Definición de la interfaz del servicio y tipos de respuesta.
 * Parte de la Fase 1 - Fundación (sin implementación remota).
 */

import type {
  LoreReactionCounts,
  LoreReactionPayload,
  LoreReactionSubmitResult,
  LoreReactionAvailability,
} from '../../types/lore-reactions';

/**
 * Contrato del servicio de reacciones de Lore.
 * Cualquier implementación (fallback, Supabase, mock) debe cumplir esta interfaz.
 */
export interface LoreReactionServiceContract {
  readonly isAvailable: boolean;
  readonly availability: LoreReactionAvailability;

  /**
   * Obtiene los contadores agregados por tipo de reacción para un capítulo.
   * Debe ser seguro para lectura pública (sin autenticación).
   */
  getCounts(chapterSlug: string): Promise<LoreReactionCounts>;

  /**
   * Envía una reacción del usuario.
   * Debe ser idempotente via `idempotencyKey`.
   * Debe respetar rate limiting (futuro: Upstash).
   */
  submitReaction(payload: LoreReactionPayload): Promise<LoreReactionSubmitResult>;
}

/**
 * Resultado estándar de disponibilidad del servicio.
 * Usado por el factory para decidir qué implementación instanciar.
 */
export interface ServiceAvailabilityResult {
  available: boolean;
  reason: 'configured' | 'unconfigured' | 'invalid_config' | 'unavailable' | 'maintenance';
  serviceType: 'fallback' | 'supabase' | 'mock';
}

/**
 * Valida que las variables públicas requeridas estén presentes y tengan formato válido.
 * No valida secretos (service_role, JWT, etc.) - solo variables PUBLIC_*.
 */
export function validatePublicConfig(): ServiceAvailabilityResult {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return {
      available: false,
      reason: 'unconfigured',
      serviceType: 'fallback',
    };
  }

  // Validación básica de formato (no conecta, solo sintaxis)
  try {
    new URL(url);
    if (!key.startsWith('eyJ') || key.split('.').length !== 3) {
      // JWT básico: 3 partes separadas por punto
      return {
        available: false,
        reason: 'invalid_config',
        serviceType: 'fallback',
      };
    }
  } catch {
    return {
      available: false,
      reason: 'invalid_config',
      serviceType: 'fallback',
    };
  }

  return {
    available: true,
    reason: 'configured',
    serviceType: 'supabase',
  };
}

/**
 * Tipos de error estandarizados para el cliente.
 * Permiten manejo uniforme sin acoplar a implementación específica.
 */
export const LoreReactionErrorCodes = {
  RATE_LIMITED: 'RATE_LIMITED',
  IDEMPOTENCY_CONFLICT: 'IDEMPOTENCY_CONFLICT',
  INVALID_KIND: 'INVALID_KIND',
  INVALID_CHAPTER: 'INVALID_CHAPTER',
  UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type LoreReactionErrorCode = typeof LoreReactionErrorCodes[keyof typeof LoreReactionErrorCodes];

export interface LoreReactionError extends Error {
  code: LoreReactionErrorCode;
  retryAfter?: number;
  details?: Record<string, unknown>;
}

export function createLoreReactionError(
  code: LoreReactionErrorCode,
  message: string,
  retryAfter?: number
): LoreReactionError {
  const err = new Error(message) as LoreReactionError;
  err.code = code;
  if (retryAfter) err.retryAfter = retryAfter;
  return err;
}
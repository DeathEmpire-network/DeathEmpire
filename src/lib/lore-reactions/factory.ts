/**
 * Lore Reactions - Service Factory
 * Factoría que decide qué implementación usar en build time (Astro).
 * Zero client JS: la decisión se toma en build, no en runtime del cliente.
 *
 * Estrategia:
 * - Si PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_PUBLISHABLE_KEY están presentes y válidas
 *   → intenta cargar implementación Supabase (futura, lazy-loaded)
 * - En cualquier otro caso → UnavailableLoreReactionService (fallback seguro)
 *
 * Zero client JS: el bundle del cliente solo incluye UnavailableLoreReactionService
 * salvo que ambas variables estén presentes Y la implementación Supabase exista.
 */

import type { LoreReactionServiceContract } from './contracts';
import { UnavailableLoreReactionService, unavailableLoreReactionService } from './fallback';
import { validatePublicConfig } from './contracts';

let _serviceInstance: LoreReactionServiceContract | null = null;

/**
 * Obtiene la instancia del servicio de reacciones (singleton por proceso de build).
 * La decisión se toma UNA vez en build time.
 */
export function getLoreReactionService(): LoreReactionServiceContract {
  if (_serviceInstance) {
    return _serviceInstance;
  }

  const config = validatePublicConfig();

  if (config.available && config.serviceType === 'supabase') {
    // Futuro: cargar implementación Supabase dinámicamente
    // Por ahora, fallback seguro aunque las vars estén configuradas
    // hasta que la implementación real exista.
    console.info('[LoreReactions] Supabase config detected, but implementation not yet available. Using fallback.');
    _serviceInstance = unavailableLoreReactionService;
    return _serviceInstance;
  }

  // Fallback por defecto (Fase 1: siempre este camino)
  _serviceInstance = unavailableLoreReactionService;
  return _serviceInstance;
}

/**
 * Fuerza reinstanciación (útil para testing).
 * No usar en producción.
 */
export function resetLoreReactionService(): void {
  _serviceInstance = null;
}

/**
 * Verifica si el servicio real está disponible sin instanciarlo.
 * Útil para UI condicional (mostrar/ocultar componente).
 */
export function isLoreReactionServiceAvailable(): boolean {
  const config = validatePublicConfig();
  return config.available && config.serviceType === 'supabase';
}

/**
 * Obtiene la razón de disponibilidad para logging/UI.
 */
export function getLoreReactionAvailabilityReason(): string {
  const config = validatePublicConfig();
  return config.reason;
}
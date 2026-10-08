/**
 * Integrations Config - Validación de variables públicas
 * Solo valida formato de variables PUBLIC_* (sin secretos).
 * Usado por factory.ts para decidir disponibilidad del servicio.
 */

export interface IntegrationConfig {
  supabase: {
    url: string | null;
    publishableKey: string | null;
    isValid: boolean;
  };
}

/**
 * Obtiene y valida la configuración de Supabase desde variables de entorno.
 * Solo variables PUBLIC_* - nunca secretos.
 * Ejecución en build time (Astro).
 */
export function getSupabaseConfig(): IntegrationConfig['supabase'] {
  const url = import.meta.env.PUBLIC_SUPABASE_URL ?? null;
  const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? null;

  let isValid = false;

  if (url && key) {
    try {
      new URL(url);
      // Validación básica de JWT: 3 partes separadas por punto
      const keyParts = key.split('.');
      if (keyParts.length === 3 && keyParts.every((part: string) => part.length > 0)) {
        isValid = true;
      }
    } catch {
      // URL inválida
    }
  }

  return { url, publishableKey: key ? '***' : null, isValid }; // key ocultada en logs
}

/**
 * Verifica si la configuración de Supabase está completa y válida.
 * Usado por factory.ts para decidir servicio.
 */
export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return config.isValid;
}

/**
 * Obtiene la razón por la que Supabase no está configurado.
 * Útil para logging y UI de diagnóstico.
 */
export function getSupabaseUnconfiguredReason(): string {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url && !key) return 'missing_both';
  if (!url) return 'missing_url';
  if (!key) return 'missing_key';

  try {
    new URL(url);
  } catch {
    return 'invalid_url';
  }

  const keyParts = (import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '').split('.');
  if (keyParts.length !== 3 || keyParts.some((part: string) => part.length === 0)) {
    return 'invalid_key_format';
  }

  return 'unknown';
}

/**
 * Obtiene configuración completa de todas las integraciones futuras.
 * Extensible para Upstash, QStash, etc.
 */
export function getIntegrationsConfig(): {
  supabase: IntegrationConfig['supabase'];
  // upstash: { token: string | null; isValid: boolean };
  // qstash: { token: string | null; isValid: boolean };
} {
  return {
    supabase: getSupabaseConfig(),
    // upstash: { token: import.meta.env.UPSTASH_TOKEN ?? null, isValid: false },
    // qstash: { token: import.meta.env.QSTASH_TOKEN ?? null, isValid: false },
  };
}

/**
 * Variables públicas permitidas (documentación en runtime).
 * Útil para validación en CI/CD y auditoría.
 */
export const ALLOWED_PUBLIC_VARS = [
  'PUBLIC_SUPABASE_URL',
  'PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  // 'UPSTASH_TOKEN',
  // 'QSTASH_TOKEN',
] as const;

export type AllowedPublicVar = typeof ALLOWED_PUBLIC_VARS[number];
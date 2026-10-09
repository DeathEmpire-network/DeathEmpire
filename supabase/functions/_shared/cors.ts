/**
 * CORS utilities for Supabase Edge Functions
 */

export function getAllowedOrigin(): string {
  const origin = Deno.env.get('ALLOWED_ORIGIN');
  if (!origin) throw new Error('Missing env: ALLOWED_ORIGIN');
  return origin;
}

export function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'content-type, x-de-visitor-id, apikey, authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  } as const;
}
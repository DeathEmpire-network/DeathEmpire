/**
 * Identity utilities for Lore Reactions Edge Function
 */

export async function getUserHash(visitorId: string): Promise<string> {
  const hmacSecret = Deno.env.get('HMAC_SECRET');
  if (!hmacSecret) throw new Error('Missing env: HMAC_SECRET');
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(hmacSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(visitorId)
  );
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getVisitorIdFromHeaders(headers: Headers): string | null {
  return headers.get('x-de-visitor-id');
}
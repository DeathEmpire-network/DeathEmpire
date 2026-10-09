/**
 * Supabase Edge Function: Lore Reactions Submit
 * Endpoint seguro para envío de reacciones.
 * 
 * Flujo:
 * 1. Valida Origin contra ALLOWED_ORIGIN
 * 2. Lee visitor ID del header x-de-visitor-id
 * 3. Aplica HMAC con secreto privado -> user_hash
 * 4. Rate limit via Upstash (20/h, burst 5/10s)
 * 5. Valida idempotency_key
 * 6. Llama RPC submit_lore_reaction (SECURITY DEFINER)
 * 7. Retorna { success, counts } o error 429/409/503
 */

import { serve } from 'std/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { Redis } from 'npm:@upstash/redis@1';
import { Ratelimit } from 'npm:@upstash/ratelimit@1';

import { corsHeaders, getAllowedOrigin } from '../_shared/cors.ts';
import { validateVisitorId, validateIdempotencyKey, validateKind, validateChapterId } from '../_shared/validation.ts';
import { getUserHash } from '../_shared/identity.ts';
import { checkRateLimit } from '../_shared/rate-limit.ts';

const VALID_KINDS = [
  'imperial_loyalty',
  'mana_corruption',
  'inquisitorial_alert',
  'consumed_by_void',
] as const;

interface SubmitRequest {
  chapter_id: string;
  kind: string;
  idempotency_key: string;
}

function getEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

serve(async (req) => {
  const origin = getAllowedOrigin();
  
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(origin) });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED' }), {
      status: 405,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  }

  try {
    // 1. Obtener visitor ID del header
    const visitorId = req.headers.get('x-de-visitor-id');
    const visitorValidation = validateVisitorId(visitorId);
    if (!visitorValidation.valid) {
      return new Response(JSON.stringify({ success: false, error: visitorValidation.error }), {
        status: 400,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    // 2. Rate limit
    const { allowed, retryAfter } = await checkRateLimit(visitorId!);
    if (!allowed) {
      return new Response(JSON.stringify({ success: false, error: 'RATE_LIMITED', retryAfter }), {
        status: 429,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    // Parsear body
    let body: SubmitRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'INVALID_JSON' }), {
        status: 400,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    // Validaciones
    const chapterValidation = validateChapterId(body.chapter_id);
    if (!chapterValidation.valid) {
      return new Response(JSON.stringify({ success: false, error: chapterValidation.error }), {
        status: 400,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    const kindValidation = validateKind(body.kind);
    if (!kindValidation.valid) {
      return new Response(JSON.stringify({ success: false, error: kindValidation.error }), {
        status: 400,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    const idempotencyValidation = validateIdempotencyKey(body.idempotency_key);
    if (!idempotencyValidation.valid) {
      return new Response(JSON.stringify({ success: false, error: idempotencyValidation.error }), {
        status: 400,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    // 3. Verificar idempotencia en Upstash
    const redisUrl = Deno.env.get('UPSTASH_REDIS_REST_URL');
    const redisToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');
    
    if (!redisUrl || !redisToken) {
      return new Response(JSON.stringify({ success: false, error: 'UPSTASH_NOT_CONFIGURED' }), {
        status: 503,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    const redis = new Redis({ url: redisUrl, token: redisToken });
    const idempotencyKey = `idempotency:lore:${body.chapter_id}:${body.kind}:${body.idempotency_key}`;
    const exists = await redis.get(`idempotency:${idempotencyKey}`);
    if (exists) {
      return new Response(JSON.stringify({ success: false, error: 'IDEMPOTENCY_CONFLICT' }), {
        status: 409,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    // 4. Derivar user_hash via HMAC
    const userHash = await getUserHash(visitorId!);

    // 5. Llamar RPC submit_lore_reaction (SECURITY DEFINER)
    const supabase = createClient(
      getEnv('SUPABASE_URL'),
      getEnv('SUPABASE_SERVICE_ROLE_KEY')
    );

    const { data, error } = await supabase.rpc('submit_lore_reaction', {
      p_chapter_id: body.chapter_id,
      p_kind: body.kind,
      p_user_hash: userHash,
      p_idempotency_key: body.idempotency_key,
    });

    if (error) {
      console.error('[Edge] RPC error:', error);
      return new Response(JSON.stringify({ success: false, error: 'INTERNAL_ERROR' }), {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    // 6. Marcar idempotencia (24h TTL)
    await redis.set(`idempotency:${idempotencyKey}`, '1', { ex: 86400 });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[Edge] Error:', err);
    return new Response(JSON.stringify({ success: false, error: 'INTERNAL_ERROR' }), {
      status: 500,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  }
});
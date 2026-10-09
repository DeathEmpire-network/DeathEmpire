/**
 * Rate limiting utilities for Lore Reactions Edge Function
 */

import { Ratelimit } from 'npm:@upstash/ratelimit@1';

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

export async function checkRateLimit(visitorId: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const redisUrl = Deno.env.get('UPSTASH_REDIS_REST_URL');
  const redisToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');
  
  if (!redisUrl || !redisToken) {
    // Upstash no configurado -> permitir (degradación graceful)
    return { allowed: true };
  }

  // Import Redis dynamically - use any to avoid type conflicts between packages
  const { Redis: RedisClient } = await import('npm:@upstash/redis@1');
  const redis = new RedisClient({ url: redisUrl, token: redisToken });
  
  const hourlyLimit = new Ratelimit({
    // deno-lint-ignore no-explicit-any
    redis: redis as any,
    limiter: Ratelimit.slidingWindow(20, '1 h'),
    prefix: 'de:lore-reactions:hour',
  });

  const burstLimit = new Ratelimit({
    // deno-lint-ignore no-explicit-any
    redis: redis as any,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
    prefix: 'de:lore-reactions:burst',
  });

  const hourResult = await hourlyLimit.limit(`user:${visitorId}`);
  if (!hourResult.success) {
    return { allowed: false, retryAfter: Math.ceil((hourResult.reset - Date.now()) / 1000) };
  }

  const burstResult = await burstLimit.limit(`user:${visitorId}`);
  if (!burstResult.success) {
    return { allowed: false, retryAfter: Math.ceil((burstResult.reset - Date.now()) / 1000) };
  }

  return { allowed: true };
}
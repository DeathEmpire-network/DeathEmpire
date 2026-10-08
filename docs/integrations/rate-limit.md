# Lore Reactions - Estrategia de Rate Limit (Fase 2+)

## Objetivos

- Prevenir spam/abuso de reacciones
- Garantizar idempotencia (mismo usuario no vota 2x mismo tipo)
- Degradación graceful si Upstash no disponible
- Coste predecible y bajo

---

## Arquitectura

```
Cliente (Libro) → RPC Supabase (validación + idempotency)
                      ↓
              Upstash Redis (rate limit + idempotency keys)
                      ↓
              Si OK → INSERT en lore_reactions
              Si Rate Limited → 429 + retryAfter
```

---

## Parámetros Sugeridos

| Parámetro | Valor | Justificación |
|-----------|-------|---------------|
| **Límite** | 20 reacciones / hora / usuario | Suficiente para lectura casual, previene bots |
| **Ventana** | 1 hora (3600s) | Rolling window |
| **Clave** | `ratelimit:lore:{userId}:{windowStart}` | Por usuario, rotando cada hora |
| **TTL** | 3600s (1 hora) + buffer | Expiración automática |
| **Burst** | 5 req/10s | Permite ráfaga inicial legítima |

---

## Claves Redis (Upstash)

### Rate Limit
```
Key:   ratelimit:lore:{userId}:{unixHour}
Type:  Counter (INCR + EXPIRE)
TTL:   3600s
```

### Idempotency (complementario a constraint DB)
```
Key:   idempotency:lore:{userId}:{chapterSlug}:{kind}
Type:  String (SET NX EX 86400)
TTL:   86400s (24h) - cubre ventana de reintentos
Value: "1" (existencia = ya reaccionado)
```

---

## Implementación (Edge Function / Serverless)

```typescript
// supabase/functions/rate-limit/index.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: Deno.env.get('UPSTASH_REDIS_REST_URL')!,
  token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN')!,
});

const RATE_LIMIT = 20;      // por hora
const BURST_LIMIT = 5;      // por 10s
const WINDOW_MS = 3600_000; // 1h
const BURST_WINDOW_MS = 10_000; // 10s

export async function checkRateLimit(
  userId: string,
  action: 'reaction'
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now = Date.now();
  const hourWindow = Math.floor(now / 3_600_000);
  const burstWindow = Math.floor(now / 10_000);

  const hourKey = `ratelimit:lore:${userId}:${hourWindow}`;
  const burstKey = `ratelimit:lore:burst:${userId}:${burstWindow}`;

  // Pipeline para atomicidad
  const pipeline = redis.pipeline();
  pipeline.incr(hourKey);
  pipeline.expire(hourKey, 3600);
  pipeline.incr(burstKey);
  pipeline.expire(burstKey, 10);
  const results = await pipeline.exec();

  const hourCount = results[0] as number;
  const burstCount = results[2] as number;

  if (burstCount > BURST_LIMIT) {
    return { allowed: false, retryAfter: 10 };
  }
  if (hourCount > RATE_LIMIT) {
    const ttl = await redis.ttl(hourKey);
    return { allowed: false, retryAfter: ttl };
  }

  return { allowed: true };
}
```

---

## Idempotency Key - Cliente

```typescript
// Cliente: generar clave determinista
function generateIdempotencyKey(
  userId: string,
  chapterSlug: string,
  kind: LoreReactionKind
): string {
  const input = `${userId}:${chapterSlug}:${kind}`;
  // SHA-256 hex (Web Crypto API)
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Uso en submit
const idempotencyKey = generateIdempotencyKey(user.id, 'chapter-1', 'imperial_loyalty');
await supabase.rpc('submit_lore_reaction', {
  p_chapter_slug: 'chapter-1',
  p_reaction_kind: 'imperial_loyalty',
  p_idempotency_key: idempotencyKey
});
```

---

## Comportamiento de Rechazo

| Escenario | Respuesta HTTP | Cuerpo | Cliente |
|-----------|----------------|--------|---------|
| Rate limit hora | 429 | `{ error: "RATE_LIMITED", retryAfter: 1800 }` | Mostrar toast "Demasiadas reacciones, intenta en 30min" |
| Rate limit burst | 429 | `{ error: "RATE_LIMITED", retryAfter: 10 }` | Reintento automático con backoff |
| Idempotency conflict | 409 | `{ error: "IDEMPOTENCY_CONFLICT" }` | Silencioso - ya reaccionado |
| Upstash down | 503 | `{ error: "SERVICE_UNAVAILABLE" }` | Fallback graceful, reintento |

---

## Configuración Upstash (Dashboard)

1. **Crear base de datos Redis** (región cercana a Supabase)
2. **Configurar variables en hosting**:
   ```
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxx
   ```
3. **Configurar límites** en código (no en Dashboard para versionado)

---

## Coste Estimado (Upstash Free Tier)

| Métrica | Estimación | Coste |
|---------|------------|-------|
| Requests/día | 10,000 usuarios × 5 reacciones = 50k | Free (100k/día) |
| Almacenamiento | ~100k keys × 100 bytes = 10MB | Free (256MB) |
| **Total** | | **$0/mes** |

---

## Degradación Graceful

Si Upstash no disponible:
1. **Log warning** (no romper request)
2. **Permitir request** (confiar en constraint DB + idempotency key)
3. **Alertar** en monitoring (PagerDuty/Datadog/Sentry)

```typescript
// En RPC Supabase
try {
  const { allowed, retryAfter } = await checkRateLimit(userId, 'reaction');
  if (!allowed) throw createRateLimitError(retryAfter);
} catch (err) {
  if (err.code !== 'UPSTASH_UNAVAILABLE') throw err;
  console.warn('[RateLimit] Upstash unavailable, allowing request');
  // Continuar sin rate limit (protección DB + idempotency)
}
```

---

## Variables de Entorno (Futuro - Fase 2+)

```bash
# Solo en servidor (Edge Functions) - NUNCA en PUBLIC_*
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx

# Configuración (opcional, defaults en código)
LORE_RATE_LIMIT_PER_HOUR=20
LORE_BURST_LIMIT=5
LORE_RATE_LIMIT_WINDOW_MS=3600000
```

---

## Testing Rate Limit

```bash
# Local con Upstash dev
UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=... npm run dev

# Test manual: 25 reacciones rápidas → 429 en la 21
# Test burst: 6 reacciones en <10s → 429
# Test idempotency: mismo key 2x → 409
```

---

## Monitoreo

- **Métricas clave**: `rate_limit_hits`, `rate_limit_rejected`, `upstash_latency_p99`
- **Alertas**: >5% rejected en 5min, Upstash latency >500ms
- **Dashboard**: Upstash Dashboard > Metrics
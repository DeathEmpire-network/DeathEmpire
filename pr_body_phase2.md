## What

- **Migración SQL completa** (`docs/integrations/supabase-lore-reactions-migration.sql`):
  - Tabla `lore_reactions` con UUID, chapter_id, kind (CHECK 4 valores), user_hash, idempotency_key (UNIQUE)
  - Índices en (chapter_id, kind) y (user_hash, created_at)
  - Vista `lore_reaction_counts` (chapter_id, kind, count) - lectura pública
  - RPC `submit_lore_reaction` (SECURITY DEFINER): valida auth, kind, idempotency_key, inserta idempotente, retorna {success, chapter_id, kind, count}
  - RLS: tabla sin SELECT/INSERT/UPDATE/DELETE para cliente; vista SELECT público; RPC EXECUTE público
  - Grants apropiados

- **Documentación actualizada**:
  - `activation.md`: pasos reales (Dashboard + CLI), verificación post-migración (queries SQL), rollback
  - `rate-limit.md`: estrategia Upstash real (claves, TTL 1h/24h, límites 20/h + burst 5/10s, idempotency keys, comportamiento 429/409/503, degradación graceful)
  - `public-client-data-boundary.md`: frontera datos cliente/servidor, variables permitidas/prohibidas, reglas CI/CD, reglas dev, checklist pre-deploy

## Risk

Medio: cambios en DB (tabla, vista, RPC, RLS). No toca frontend.

## Review

- SQL en `docs/integrations/supabase-lore-reactions-migration.sql`
- Docs en `docs/integrations/` y `docs/security/`
- Sin cambios en `src/` (BookReader intacto)
- Build: 44 páginas ✅
- Astro check: 0 errors ✅
- E2E: audit 5/5, integrations fallback 3/3 ✅
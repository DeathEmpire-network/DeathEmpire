# Public-Client Data Boundary - DeathEmpire

## Principio Fundamental

El cliente (navegador) nunca debe tener acceso directo a datos sensibles ni a escritura en la base de datos.

Este documento define la frontera estricta entre lo que el cliente puede y no puede hacer, y cómo se enforcea esta frontera en la arquitectura.

---

## Lo que el Cliente PUEDE hacer

| Acción | Mecanismo | Validación |
|--------|-----------|------------|
| Leer contadores agregados | GET /rest/v1/lore_reaction_counts?chapter_id=eq.chapter-1 | Vista pública lore_reaction_counts (RLS: SELECT público) |
| Enviar reacción | RPC submit_lore_reaction | Validación server-side: auth, kind, idempotency_key |
| Leer contenido del Libro | Páginas estáticas generadas en build | Contenido público, sin auth |

---

## Lo que el Cliente NO PUEDE hacer

| Acción | Por qué | Enforcement |
|--------|---------|-------------|
| Leer filas de lore_reactions | Exponen user_hash, patrones de comportamiento | RLS: SELECT denegado a anon y authenticated (solo own via setting) |
| INSERT directo en lore_reactions | Bypass validación, idempotencia, rate limit | RLS: INSERT denegado a todos los roles cliente |
| UPDATE/DELETE en lore_reactions | Manipulación de datos | RLS: UPDATE/DELETE denegado a todos los roles cliente |
| Leer user_hash de otros usuarios | Privacidad, profiling | RLS: solo user_hash = current_setting('app.current_user_hash') |
| Ejecutar SQL arbitrario | SQL injection, data breach | Solo RPC submit_lore_reaction expuesta |
| Acceder a service_role | Control total de DB | Nunca en cliente, solo Edge Functions/servidor |

---

## Variables de Entorno - Clasificación

| Variable | Lado | ¿Exponer en cliente? |
|----------|------|---------------------|
| PUBLIC_SUPABASE_URL | Cliente | ✅ Sí (pública por diseño) |
| PUBLIC_SUPABASE_PUBLISHABLE_KEY | Cliente | ✅ Sí (anon key, diseñada para cliente) |
| SUPABASE_SERVICE_ROLE_KEY | Servidor | ❌ NUNCA |
| SUPABASE_JWT_SECRET | Servidor | ❌ NUNCA |
| UPSTASH_REDIS_REST_URL | Servidor (Edge) | ❌ NUNCA |
| UPSTASH_REDIS_REST_TOKEN | Servidor (Edge) | ❌ NUNCA |

---

## Reglas de Auditoría (CI/CD)

```yaml
- name: Verificar variables públicas
  run: |
    if grep -r "SUPABASE_SERVICE_ROLE_KEY|SUPABASE_JWT_SECRET|UPSTASH_REDIS_REST_TOKEN" dist/; then
      echo "SECRETS ENCONTRADOS EN BUILD"
      exit 1
    fi
    if grep -r "import.meta.env\.(?!PUBLIC_)" src/ --include="*.ts" --include="*.astro"; then
      echo "VARIABLES NO PUBLICAS EN CLIENTE"
      exit 1
    fi
```

---

## Reglas de Desarrollo

### Permitido en código cliente (src/)

```typescript
const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const { data } = await supabase.rpc('submit_lore_reaction', { ... });
const { data } = await supabase.from('lore_reaction_counts').select('*');
```

### PROHIBIDO en código cliente (src/)

```typescript
const { data } = await supabase.from('lore_reactions').select('*');
const supabaseAdmin = createClient(url, serviceRoleKey);
const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
```

---

## Validación en Build Time

El factory `getLoreReactionService()` decide en build time qué servicio usar:

```typescript
const config = validatePublicConfig();
if (config.available) {
  // Futuro: cargar SupabaseLoreReactionService
} else {
  // Actual: UnavailableLoreReactionService (fallback)
}
```

Garantiza:
- Zero client JS para fallback (tree-shaking)
- Decisión en build = no lógica de configuración en runtime cliente
- Imposible activar accidentalmente sin variables de entorno

---

## Checklist de Seguridad (Pre-Deploy)

- grep -r "service_role|JWT_SECRET|SERVICE_ROLE" dist/ → vacío
- grep -r "UPSTASH_REDIS_REST_TOKEN" dist/ → vacío
- grep -r "import.meta.env\.(?!PUBLIC_)" src/ → vacío
- npx playwright test e2e/integrations/ → 3/3 passed
- npx playwright test e2e/audit.spec.ts → 5/5 passed
- Supabase Dashboard: RLS enabled en lore_reactions
- Supabase Dashboard: Policies correctas en lore_reactions y lore_reaction_counts
- Supabase Dashboard: submit_lore_reaction EXECUTE granted to authenticated
- Supabase Dashboard: lore_reaction_counts GRANT SELECT TO anon, authenticated

---

## Contacto / Escalación

Si detectas una violación de esta frontera:
1. Inmediato: Revertir deploy, rotar secretos afectados
2. Análisis: Revisar logs Supabase (Authentication > Logs)
3. Corrección: Fix en código, auditoría completa
4. Post-mortem: Documentar y actualizar este documento
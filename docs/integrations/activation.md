# Lore Reactions - Guía de Activación (Fase 2+)

## Variables Requeridas

| Variable | Descripción | Dónde configurar | Requerida |
|----------|-------------|------------------|-----------|
| `PUBLIC_SUPABASE_URL` | URL del proyecto Supabase (ej: `https://xxx.supabase.co`) | Vercel/Netlify/Cloudflare Env Vars / `.env.local` | **Sí** |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `anon` key (JWT público) | Mismo lugar | **Sí** |

**NUNCA** configurar como públicas:
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `DATABASE_PASSWORD`
- Tokens Upstash/QStash/GitHub

---

## Dónde Configurar

### Vercel (recomendado)
```
Project Settings > Environment Variables
├── PUBLIC_SUPABASE_URL = https://xxxx.supabase.co
├── PUBLIC_SUPABASE_PUBLISHABLE_KEY = eyJ...
└── (NO agregar SUPABASE_SERVICE_ROLE_KEY aquí)
```

### Netlify
```
Site Settings > Environment Variables
Same as above
```

### Cloudflare Pages
```
Settings > Environment Variables
Same as above
```

### Desarrollo Local (`.env.local`)
```bash
# .env.local (NO commitear - en .gitignore)
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Orden de Activación

1. **Crear proyecto Supabase** (si no existe)
2. **Ejecutar migración SQL** (`docs/integrations/supabase-lore-reactions-migration.sql`)
3. **Verificar RLS** en Dashboard > Authentication > Policies
4. **Configurar variables** en proveedor de hosting
5. **Redeploy** del sitio (build detecta variables en build time)
6. **Verificar en producción**:
   - `/lore/chapter-1/` muestra botones de reacción activos
   - Consola sin errores
   - RPC `submit_lore_reaction` responde correctamente

---

## Cómo Aplicar la Migración SQL (Paso a Paso)

### Opción A: Supabase Dashboard (recomendado para primera vez)

1. Abrir **Supabase Dashboard** > tu proyecto
2. Ir a **SQL Editor** > New query
3. Copiar **todo** el contenido de `docs/integrations/supabase-lore-reactions-migration.sql`
4. Ejecutar (Run)
5. Verificar que no hay errores (mensaje "Success. No rows returned")

### Opción B: Supabase CLI (recomendado para CI/CD)

```bash
# Instalar CLI
npm i -g supabase

# Login
supabase login

# Vincular proyecto (una vez)
supabase link --project-ref <tu-project-ref>

# Aplicar migración
supabase db push --include-all
# O para migración específica:
supabase migration up
```

### Verificación Post-Migración (ejecutar en SQL Editor)

```sql
-- 1. Verificar tabla
SELECT * FROM public.lore_reactions LIMIT 0;

-- 2. Verificar vista
SELECT * FROM public.lore_reaction_counts LIMIT 5;

-- 3. Verificar función RPC
SELECT public.submit_lore_reaction('test-chapter', 'imperial_loyalty', 'test_hash', 'test_key_1');

-- 4. Verificar RLS activo
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('lore_reactions', 'lore_reaction_counts');

-- 5. Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'lore_reactions';

-- 6. Verificar grants
SELECT * FROM information_schema.routine_privileges
WHERE routine_name = 'submit_lore_reaction';
```

---

## Orden de Activación (Producción)

1. **Crear proyecto Supabase** (si no existe)
2. **Ejecutar migración SQL** (`docs/integrations/supabase-lore-reactions-migration.sql`)
3. **Verificar RLS** en Dashboard > Authentication > Policies
4. **Configurar variables** en proveedor de hosting
5. **Redeploy** del sitio (build detecta variables en build time)
6. **Verificar en producción**:
   - `/lore/chapter-1/` muestra botones de reacción activos
   - Consola sin errores
   - RPC `submit_lore_reaction` responde correctamente

---

## Cómo Aplicar la Migración SQL (Paso a Paso)

### Opción A: Supabase Dashboard (recomendado para primera vez)

1. Abrir **Supabase Dashboard** > tu proyecto
2. Ir a **SQL Editor** > New query
3. Copiar **todo** el contenido de `docs/integrations/supabase-lore-reactions-migration.sql`
4. Ejecutar (Run)
5. Verificar que no hay errores (mensaje "Success. No rows returned")

### Opción B: Supabase CLI (recomendado para CI/CD)

```bash
# Instalar CLI
npm i -g supabase

# Login
supabase login

# Vincular proyecto (una vez)
supabase link --project-ref <tu-project-ref>

# Aplicar migración
supabase db push --include-all
# O para migración específica:
supabase migration up
```

### Verificación Post-Migración (ejecutar en SQL Editor)

```sql
-- 1. Verificar tabla
SELECT * FROM public.lore_reactions LIMIT 0;

-- 2. Verificar vista
SELECT * FROM public.lore_reaction_counts LIMIT 5;

-- 3. Verificar función RPC
SELECT public.submit_lore_reaction('test-chapter', 'imperial_loyalty', 'test_hash', 'test_key_1');

-- 4. Verificar RLS activo
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('lore_reactions', 'lore_reaction_counts');

-- 5. Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'lore_reactions';

-- 6. Verificar grants
SELECT * FROM information_schema.routine_privileges
WHERE routine_name = 'submit_lore_reaction';
```

---

## Orden de Activación (Producción)

1. **Crear proyecto Supabase** (si no existe)
2. **Ejecutar migración SQL** (`docs/integrations/supabase-lore-reactions-migration.sql`)
3. **Verificar RLS** en Dashboard > Authentication > Policies
3. **Configurar variables** en proveedor de hosting
4. **Redeploy** del sitio (build detecta variables en build time)
5. **Verificar en producción**:
   - `/lore/chapter-1/` muestra botones de reacción activos
   - Consola sin errores
   - RPC `submit_lore_reaction` responde correctamente

---

## Cómo Desactivar

### Opción 1: Remover variables (recomendado)
- Borrar `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` del hosting
- Redeploy → fallback automático a "no disponible"

### Opción 2: Modo mantenimiento (futuro)
```typescript
// En factory.ts o config
export const MAINTENANCE_MODE = import.meta.env.PUBLIC_MAINTENANCE === 'true';
```

### Opción 3: Feature flag en Supabase
- Deshabilitar RPC `submit_lore_reaction` en Dashboard
- O revocar permisos `EXECUTE` en `authenticated`

---

## Cómo Probar Localmente

### 1. Con Supabase local (CLI)
```bash
# Instalar CLI
npm i -g supabase

# Iniciar stack local
supabase start

# Aplicar migraciones
supabase db reset

# Obtener credenciales locales
supabase status
# Copiar API URL y anon key a .env.local
```

### 2. Con proyecto remoto (staging)
```bash
# .env.local
PUBLIC_SUPABASE_URL=https://staging-xxxx.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...

# Build y preview
npm run build
npm run preview
```

### 3. Verificar en dev
```bash
npm run dev
# Abrir http://localhost:4321/DeathEmpire/lore/chapter-1/
# Verificar: botones habilitados, contadores cargan, submit funciona
```

---

## Cómo Auditar Secretos

### CI/CD (GitHub Actions recomendado)
```yaml
# .github/workflows/secret-scan.yml
name: Secret Scan
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: TruffleHog
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
```

### Pre-commit hook (opcional)
```bash
# .husky/pre-commit
npx secretlint "**/*"
```

### Variables a auditar (NUNCA deben aparecer)
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_DB_PASSWORD`
- `UPSTASH_TOKEN`
- `QSTASH_TOKEN`
- `GITHUB_TOKEN` (excepto en CI)
- Cualquier `PRIVATE_*` o `SECRET_*`

---

## Verificación Post-Activación

| Check | Comando/Verificación |
|-------|---------------------|
| Build ok | `npm run build` ✅ |
| Types ok | `npx astro check` ✅ |
| E2E fallback | `npx playwright test e2e/integrations/` ✅ |
| E2E con Supabase | Test manual en staging |
| Consola limpia | Sin errores en `/lore/chapter-1/` |
| Sin secretos | `grep -r "service_role\|JWT_SECRET" dist/` → vacío |
| RLS ok | Supabase Dashboard > Policies ✅ |

---

## Rollback Rápido

Si algo falla en producción:

1. **Remover variables** en hosting → redeploy (30-60s)
2. **O** revertir deploy en Vercel/Netlify (instantáneo)
3. **O** `git revert <commit>` + push → auto-deploy

El fallback `UnavailableLoreReactionService` garantiza que el Libro nunca se rompa.
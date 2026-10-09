# DeathEmpire — Sitio Web Oficial

Sitio web estático (Astro + GitHub Pages) del MMORPG **DeathEmpire**: lore interactivo, arquitectura técnica, game design y documentación del proyecto.

---

## 🌐 Demo

**Producción:** https://deathempire-network.github.io/DeathEmpire/
**Staging:** PR previews via GitHub Actions

---

## 📖 Contenido

| Sección | Descripción |
|---------|-------------|
| **Lore** | Libro interactivo bilingüe (EN/ES) — 10 capítulos, navegación 3D, reacciones temáticas |
| **Gameplay** | Clases, roles, stats, equipamiento, crafting, economía, transporte |
| **World** | Generación procedural, dungeons, RoomNode, Dungeon Director |
| **Architecture** | Folia, Paper, Velocity, Backend .NET, gRPC, plugins |
| **Project** | Feature registry, status, decisions, remediation plan |
| **Repositories** | Registro canónico de repos (repos.yaml) |

---

## 🚀 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Dev server (background)
npm run dev

# Build producción (static export)
npm run build

# Preview build
npm run preview

# Type-check
npx astro check

# Tests E2E
npx playwright test
```

### Requisitos
- Node.js 22+
- npm 10+
- (Opcional) Supabase CLI + Docker para Edge Functions locales

---

## 🏗️ Stack

| Capa | Tecnología |
|------|------------|
| Framework | Astro 7 (static export) |
| Estilos | CSS custom properties, sin framework |
| i18n | EN/ES nativo (rutas `/es/`) |
| Lore Reader | BookReader 3D (Canvas/WebGL) |
| Reacciones | Supabase Edge Function + Upstash Redis |
| Deploy | GitHub Pages + Actions |

---

## 📁 Estructura Clave

```text
site/
├── src/
│   ├── components/          # BookReader, LoreReactions, LanguageSelector...
│   ├── pages/               # Rutas (lore/[chapter], gameplay, etc.)
│   ├── lib/lore-reactions/  # Client, Supabase service, factory, contracts
│   ├── data/                # Contenido (libro, reacciones, spreads)
│   └── styles/              # CSS global, variables
├── supabase/
│   └── functions/lore-reactions/  # Edge Function (Deno)
├── e2e/                     # Playwright tests
├── docs/                    # Docs de integración (Supabase, rate-limit, RLS)
├── public/                  # Assets estáticos (fonts, images)
└── package.json
```

---

## ⚙️ Configuración (`.env.local`)

```env
# Supabase (público — seguro en cliente)
PUBLIC_SUPABASE_URL=https://<project>.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon-key>

# Lore Reactions Edge Function
PUBLIC_LORE_REACTIONS_FUNCTION_URL=https://<project>.supabase.co/functions/v1/lore-reactions

# Privados — SOLO en Edge Function / Supabase Dashboard
# SUPABASE_SERVICE_ROLE_KEY=
# SUPABASE_JWT_SECRET=
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=
# HMAC_SECRET=
# ALLOWED_ORIGIN=https://deathempire-network.github.io
```

Ver `.env.example` para plantilla completa.

---

## 🧪 Tests

```bash
# Fallback (sin Supabase configurado)
npx playwright test e2e/integrations/lore-reactions-fallback.spec.ts

# Audit visual/funcional
npx playwright test e2e/audit.spec.ts

# Live (requiere staging con secrets)
npx playwright test e2e/integrations/lore-reactions-live.spec.ts
```

---

## 📚 Documentación

| Doc | Ubicación |
|-----|-----------|
| Arquitectura general | `../docs/architecture.md` |
| Visión DeathEmpire | `../docs/vision/VISION_DEATHEMPIRE.md` |
| Game Design | `../docs/game-design/` |
| Lore / Capítulos | `../docs/lore/` |
| Technical (Folia, Backend) | `../docs/technical/` |
| Worldgen | `../docs/worldgen/` |
| Proyecto (Status, Registry) | `../docs/project/` |
| Site integrations | `docs/` |

---

## 🔐 Seguridad

- **Ningún secreto en cliente** — solo `PUBLIC_*` vars
- **HMAC-SHA256** server-side (Edge Function)
- **Rate limiting** Upstash (20/h + 5/10s burst)
- **Idempotencia** 24h TTL en Redis
- **CORS** origen explícito (`ALLOWED_ORIGIN`)
- **GitHub Actions** pinneado via `gh actions-lock`

---

## 📦 Deploy

```bash
# Automático en push a main
git push origin main
```

Workflow: `.github/workflows/deploy.yml` → build → upload artifact → deploy to GitHub Pages

---

## 🔗 Repositorios Relacionados

| Repo | Descripción |
|------|-------------|
| **Global-Tracker** | Coordinación, manifiestos, docs (este repo) |
| **Backend** | gRPC API, PostgreSQL, orquestación |
| **Folia-Fork** | Servidor Folia custom |
| **Velocity-Fork** | Proxy Velocity custom |

Ver [`../repos.yaml`](../repos.yaml) para registro canónico.

---

## 📄 Licencia

**Pendiente de decisión.** Upstreams conservan sus licencias:
- PaperMC/Folia • PaperMC/Velocity

---

## 🤝 Contribuir

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md) (si existe) o [`../docs/project/DECISIONS.md`](../docs/project/DECISIONS.md).

---

> **DeathEmpire** — MMORPG distribuido basado en Minecraft. Cuatro reinos. Una DeathZone. El lore se escribe jugando.


## What

- Lore reactions types & contracts (4 kinds EN/ES).
- Fallback service + factory (build-time decision).
- LoreReactions UI component (disabled by default, a11y/i18n).
- Config validation for PUBLIC_SUPABASE_* (no secrets).
- Proposed SQL schema, RLS, activation guide, rate-limit strategy.
- E2E tests: fallback render, clean console, no secrets.

## Risk

Low: no remote services, no BookReader changes, no global CSS.

## Review

- Types & contracts in src/types/lore-reactions.ts and src/lib/lore-reactions/.
- LoreReactions.astro renders "not available" state.
- Config validation in src/config/integrations.ts.
- Docs in docs/integrations/.
- E2E tests in e2e/integrations/.
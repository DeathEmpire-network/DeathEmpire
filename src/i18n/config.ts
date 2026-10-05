/**
 * i18n config - DeathEmpire
 * English is the default language (/), Spanish lives under /es/.
 * Pages pass explicit enPath/esPath to BaseLayout; these helpers
 * exist for tests and future tooling.
 */

export const defaultLang = 'en' as const;
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

const BASE = '/DeathEmpire';

/** Language of a site path. Unknown paths fall back to the default. */
export function langOf(pathname: string): Locale {
  return pathname === `${BASE}/es/` || pathname.startsWith(`${BASE}/es/`)
    ? 'es'
    : 'en';
}

/** Equivalent path in the requested language. */
export function equivalentPath(pathname: string, lang: Locale): string {
  const rest = pathname.startsWith(`${BASE}/es/`)
    ? pathname.slice(`${BASE}/es`.length) || '/'
    : pathname.startsWith(BASE)
      ? pathname.slice(BASE.length) || '/'
      : pathname;
  const normalized = rest.startsWith('/') ? rest : `/${rest}`;
  return lang === 'es' ? `${BASE}/es${normalized === '/' ? '/' : normalized}` : `${BASE}${normalized}`;
}

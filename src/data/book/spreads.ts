/**
 * spreads.ts - Construcción de aperturas del Libro (EN/ES)
 * Una apertura = 2 hojas. Spread 1: (portada, página 1).
 * Cierre: (consecuencias+ficha, siguiente capítulo).
 * La paginación es editorial y manual (ver pagination.ts).
 */
import { tome, chapters, getChapter, type ChapterMeta } from './tome1';
import { narratives } from './narratives';
import { narrativesEn } from './narratives-en';
import { paginate, spreadCount } from './pagination';
import type { BookPage } from './pages';

export type Lang = 'en' | 'es';

const ui = {
  en: {
    chapterOf: (n: number, t: number) => `Chapter ${n} of ${t}`,
    spreadOf: (s: number, t: number) => `Opening ${s} of ${t}`,
    canon: 'Canon',
    dev: 'In development',
    minRead: (m: number) => `≈ ${m} min read`,
    preparing: 'Full text in preparation',
    editionFull: '',
    editionRecord: '',
    continued: '— continues',
    consequences: 'Consequences',
    keys: 'Keys',
    source: 'Source',
    archiveKicker: 'THE ARCHIVE CONTINUES',
    endOfTome: 'End of Tome I. The story continues in Season 2.',
    nextCta: 'Next chapter',
    indexCta: 'Back to the Archive',
    backArchive: 'Back to the Archive',
    paging: 'Chapter pages',
    placeholderBody:
      'Complete narrative in preparation. Record and summary follow the canonical chapter.',
  },
  es: {
    chapterOf: (n: number, t: number) => `Capítulo ${n} de ${t}`,
    spreadOf: (s: number, t: number) => `Apertura ${s} de ${t}`,
    canon: 'Canónico',
    dev: 'En desarrollo',
    minRead: (m: number) => `≈ ${m} min de lectura`,
    preparing: 'Texto completo en preparación',
    editionFull: 'EDICIÓN CANÓNICA',
    editionRecord: 'EDICIÓN CANÓNICA · ficha',
    continued: '— continúa',
    consequences: 'Consecuencias',
    keys: 'Claves',
    source: 'Fuente',
    archiveKicker: 'EL ARCHIVO CONTINÚA',
    endOfTome: 'Fin del Tomo I. La historia continúa en la Temporada 2.',
    nextCta: 'Siguiente capítulo',
    indexCta: 'Volver al Archivo',
    backArchive: 'Volver al Archivo',
    paging: 'Páginas del capítulo',
    placeholderBody:
      'Texto completo en preparación. La ficha y el resumen siguen al capítulo canónico.',
  },
};

export function spreadHref(lang: Lang, slug: string, spread: number): string {
  const base = lang === 'es' ? '/DeathEmpire/es/lore' : '/DeathEmpire/lore';
  return spread <= 1 ? `${base}/${slug}/` : `${base}/${slug}/${spread}/`;
}

export interface ChapterReader {
  chapter: ChapterMeta;
  spreads: Array<{ left: BookPage; right: BookPage }>;
  totalSpreads: number;
  title: string;
  description: string;
  indexHref: string;
  indexLabel: string;
  pagingLabel: string;
  prevChapter: { href: string; label: string } | null;
  nextChapter: { href: string; label: string } | null;
  progressOf: (s: number, t: number) => string;
  prevLabel: string;
  nextLabel: string;
  firstLabel: string;
  lastLabel: string;
}

/** Todas las aperturas de un capítulo para el lector interactivo. */
export function buildChapter(slug: string, lang: Lang): ChapterReader | null {
  const ch = getChapter(slug);
  if (!ch) return null;
  const t = ui[lang];
  const tx = textOf(ch, lang);
  const indexHref = lang === 'es' ? '/DeathEmpire/es/lore/' : '/DeathEmpire/lore/';
  const spreads: Array<{ left: BookPage; right: BookPage }> = [];

  if (!ch.hasFullText) {
    const first = buildSpread(slug, lang, 1);
    if (!first) return null;
    spreads.push({ left: first.left, right: first.right });
  } else {
    const total = totalSpreadsFor(slug, lang);
    for (let s = 1; s <= total; s++) {
      const built = buildSpread(slug, lang, s);
      if (!built) return null;
      spreads.push({ left: built.left, right: built.right });
    }
  }

  const idx = chapters.findIndex((c) => c.slug === slug);
  const prevCh = idx > 0 ? chapters[idx - 1] : null;
  const nextCh = idx < chapters.length - 1 ? chapters[idx + 1] : null;
  const prevChapter = prevCh
    ? {
        href: `${spreadHref(lang, prevCh.slug, 1)}#opening-${totalSpreadsFor(prevCh.slug, lang)}`,
        label: `${t.chapterOf(prevCh.order, tome.totalChapters)} · ${lang === 'es' ? prevCh.titleEs : prevCh.titleEn}`,
      }
    : null;
  const nextChapter = nextCh
    ? {
        href: spreadHref(lang, nextCh.slug, 1),
        label: `${t.chapterOf(nextCh.order, tome.totalChapters)} · ${lang === 'es' ? nextCh.titleEs : nextCh.titleEn}`,
      }
    : null;

  return {
    chapter: ch,
    spreads,
    totalSpreads: spreads.length,
    title: `${tx.title} — ${lang === 'es' ? tome.titleEs : tome.titleEn}`,
    description: tx.summary,
    indexHref,
    indexLabel: t.indexCta,
    pagingLabel: lang === 'es' ? 'Páginas del capítulo' : 'Chapter pages',
    prevChapter,
    nextChapter,
    progressOf: (s: number, n: number) =>
      `${t.chapterOf(ch.order, tome.totalChapters)} · ${lang === 'es' ? `Apertura ${s} de ${n}` : `Opening ${s} of ${n}`}`,
    prevLabel: lang === 'es' ? 'Anterior' : 'Previous',
    nextLabel: lang === 'es' ? 'Siguiente' : 'Next',
    firstLabel: lang === 'es' ? 'Primera apertura' : 'First opening',
    lastLabel: lang === 'es' ? 'Última apertura' : 'Last opening',
  };
}

export interface SpreadData {
  chapter: ChapterMeta;
  left: BookPage;
  right: BookPage;
  prevHref: string | null;
  prevLabel: string;
  nextHref: string | null;
  nextLabel: string;
  progressLabel: string;
  title: string;
  description: string;
  enPath: string;
  esPath: string;
  totalSpreads: number;
}

function textOf(ch: ChapterMeta, lang: Lang) {
  return {
    title: lang === 'es' ? ch.titleEs : ch.titleEn,
    subtitle: lang === 'es' ? ch.subtitleEs : ch.subtitleEn,
    summary: lang === 'es' ? ch.summaryEs : ch.summaryEn,
    period: lang === 'es' ? ch.periodEs : ch.periodEn,
    keys: lang === 'es' ? ch.keysEs : ch.keysEn,
    consequences: lang === 'es' ? ch.consequencesEs : ch.consequencesEn,
  };
}

export function totalSpreadsFor(slug: string, lang: Lang = 'en'): number {
  const ch = getChapter(slug);
  if (!ch) return 0;
  if (!ch.hasFullText) return 1;
  const langNarratives = lang === 'es' ? narratives : narrativesEn;
  return spreadCount(paginate(langNarratives[slug] ?? [], slug).length);
}

/** Construye una apertura (1-based). Null si no existe. */
export function buildSpread(slug: string, lang: Lang, spread: number): SpreadData | null {
  const ch = getChapter(slug);
  if (!ch) return null;
  const t = ui[lang];
  const tx = textOf(ch, lang);
  const idx = chapters.findIndex((c) => c.slug === slug);
  const prevCh = idx > 0 ? chapters[idx - 1] : null;
  const nextCh = idx < chapters.length - 1 ? chapters[idx + 1] : null;
  const indexHref = lang === 'es' ? '/DeathEmpire/es/lore/' : '/DeathEmpire/lore/';

  if (!ch.hasFullText) {
    if (spread !== 1) return null;
    const left: BookPage = {
      kind: 'cover',
      tomeTitle: lang === 'es' ? tome.titleEs : tome.titleEn,
      chapterLabel: t.chapterOf(ch.order, tome.totalChapters),
      title: tx.title,
      subtitle: tx.subtitle,
      editionBadge: t.editionRecord,
      statusBadge: ch.status === 'canon' ? t.canon : t.dev,
      readingNote: t.preparing,
    };
    const right: BookPage = {
      kind: 'note',
      title: tx.summary,
      body: `${t.placeholderBody} ${tx.consequences}`,
      sourceLabel: t.source,
      sourceFile: ch.sourceFile,
    };
    return finish(ch, lang, t, tx, prevCh, nextCh, left, right, spread, 1);
  }

  const pages = paginate((lang === 'es' ? narratives : narrativesEn)[slug] ?? [], slug);
  const total = spreadCount(pages.length);
  if (spread < 1 || spread > total) return null;

  // Secuencia: portada, p1..pN, cierre-ficha, cierre-siguiente.
  const seq: BookPage[] = [];
  seq.push({
    kind: 'cover',
    tomeTitle: lang === 'es' ? tome.titleEs : tome.titleEn,
    chapterLabel: t.chapterOf(ch.order, tome.totalChapters),
    title: tx.title,
    subtitle: tx.subtitle,
    editionBadge: t.editionFull,
    statusBadge: ch.status === 'canon' ? t.canon : t.dev,
    readingNote: ch.readingMinutes ? t.minRead(ch.readingMinutes) : t.preparing,
  });
  pages.forEach((paras, i) => {
    seq.push({
      kind: 'text',
      paragraphs: paras,
      continuationLabel: i > 0 ? t.continued : undefined,
    });
  });
  seq.push({
    kind: 'record',
    title: t.consequences,
    consequences: tx.consequences,
    keysTitle: t.keys,
    keys: tx.keys,
    sourceLabel: t.source,
    sourceFile: ch.sourceFile,
    statusBadge: ch.status === 'canon' ? t.canon : t.dev,
    period: tx.period,
  });
  const nextTx = nextCh ? textOf(nextCh, lang) : null;
  seq.push({
    kind: 'next',
    kicker: t.archiveKicker,
    nextTitle: nextTx ? (lang === 'es' ? nextCh!.titleEs : nextCh!.titleEn) : t.endOfTome,
    nextSubtitle: nextTx ? (lang === 'es' ? nextCh!.subtitleEs : nextCh!.subtitleEn) : undefined,
    nextHref: nextCh ? spreadHref(lang, nextCh.slug, 1) : null,
    nextCta: t.nextCta,
    indexHref,
    indexCta: t.indexCta,
  });

  const left = seq[(spread - 1) * 2];
  const right = seq[(spread - 1) * 2 + 1];
  if (!left || !right) return null;
  return finish(ch, lang, t, tx, prevCh, nextCh, left, right, spread, total);
}

function finish(
  ch: ChapterMeta,
  lang: Lang,
  t: (typeof ui)[Lang],
  tx: ReturnType<typeof textOf>,
  prevCh: ChapterMeta | null,
  nextCh: ChapterMeta | null,
  left: BookPage,
  right: BookPage,
  spread: number,
  total: number,
): SpreadData {
  // Anterior: apertura previa; en la primera, última apertura del capítulo previo o índice.
  let prevHref: string | null = null;
  let prevLabel = t.backArchive;
  if (spread > 1) {
    prevHref = spreadHref(lang, ch.slug, spread - 1);
    prevLabel = t.spreadOf(spread - 1, total);
  } else if (prevCh) {
    const prevTotal = totalSpreadsFor(prevCh.slug, lang);
    prevHref = spreadHref(lang, prevCh.slug, prevTotal);
    const prevTx = lang === 'es' ? prevCh.titleEs : prevCh.titleEn;
    prevLabel = `${t.chapterOf(prevCh.order, tome.totalChapters)} · ${prevTx}`;
  }
  // Siguiente: apertura siguiente; en la última, capítulo siguiente o índice.
  let nextHref: string | null = null;
  let nextLabel = t.backArchive;
  if (spread < total) {
    nextHref = spreadHref(lang, ch.slug, spread + 1);
    nextLabel = t.spreadOf(spread + 1, total);
  } else if (nextCh) {
    nextHref = spreadHref(lang, nextCh.slug, 1);
    const nextTx = lang === 'es' ? nextCh.titleEs : nextCh.titleEn;
    nextLabel = `${t.chapterOf(nextCh.order, tome.totalChapters)} · ${nextTx}`;
  }
  return {
    chapter: ch,
    left,
    right,
    prevHref,
    prevLabel,
    nextHref,
    nextLabel,
    progressLabel: `${t.chapterOf(ch.order, tome.totalChapters)} · ${t.spreadOf(spread, total)}`,
    title: `${tx.title} — ${lang === 'es' ? tome.titleEs : tome.titleEn}`,
    description: tx.summary,
    enPath: spreadHref('en', ch.slug, spread),
    esPath: spreadHref('es', ch.slug, spread),
    totalSpreads: total,
  };
}

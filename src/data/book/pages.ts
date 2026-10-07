/** Tipos de página del Libro. Compartidos entre BookSpread.astro y spreads.ts. */

export interface CoverPage {
  kind: 'cover';
  tomeTitle: string;
  chapterLabel: string;
  title: string;
  subtitle?: string;
  editionBadge: string;
  statusBadge: string;
  readingNote: string;
}

export interface TextPage {
  kind: 'text';
  paragraphs: string[];
  continuationLabel?: string;
}

export interface RecordPage {
  kind: 'record';
  title: string;
  consequences: string;
  keysTitle: string;
  keys: string[];
  sourceLabel: string;
  sourceFile: string;
  statusBadge: string;
  period: string;
}

export interface NextPage {
  kind: 'next';
  kicker: string;
  nextTitle: string;
  nextSubtitle?: string;
  nextHref: string | null;
  nextCta: string;
  indexHref: string;
  indexCta: string;
}

export interface NotePage {
  kind: 'note';
  title: string;
  body: string;
  sourceLabel?: string;
  sourceFile?: string;
}

export type BookPage = CoverPage | TextPage | RecordPage | NextPage | NotePage;

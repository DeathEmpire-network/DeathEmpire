/**
 * Pagination - DeathEmpire Book of Lore
 * Paginación editorial MANUAL: cada array lista cuántos párrafos
 * lleva cada página narrativa, en orden canónico. Reglas aplicadas:
 * - ninguna cita ("> ") abre página;
 * - sin párrafos huérfanos de una línea al inicio;
 * - ~5 párrafos por página.
 * Totales verificados: ch1=47, ch2=55, ch3=54, ch4=44, ch5=87.
 */

export const pageSizes: Record<string, number[]> = {
  'chapter-1': [5, 4, 4, 4, 4, 4, 4, 5, 3, 6, 4],
  'chapter-2': [4, 4, 4, 4, 4, 4, 4, 6, 4, 4, 4, 5, 4],
  'chapter-3': [4, 5, 4, 5, 4, 4, 3, 3, 3, 4, 4, 4, 3, 2, 2],
  'chapter-4': [3, 2, 4, 3, 4, 3, 3, 3, 2, 3, 3, 3, 3, 2, 3],
  'chapter-5': [5, 4, 5, 5, 4, 5, 6, 5, 6, 7, 4, 5, 8, 7, 6, 2, 3],
};

/** Divide párrafos en páginas según los tamaños editoriales. */
export function paginate(paragraphs: string[], slug: string): string[][] {
  const sizes = pageSizes[slug] ?? [paragraphs.length];
  const pages: string[][] = [];
  let i = 0;
  for (const size of sizes) {
    pages.push(paragraphs.slice(i, i + size));
    i += size;
  }
  if (i < paragraphs.length) pages.push(paragraphs.slice(i));
  return pages.filter((p) => p.length > 0);
}

/**
 * Estructura de spreads de un capítulo:
 * spread 1 = (portada, página 1); intermedios = (pN, pN+1);
 * cierre = (consecuencias+ficha, siguiente capítulo).
 * Devuelve el total de spreads (páginas narrativas siempre impares).
 */
export function spreadCount(narrativePages: number): number {
  return Math.ceil((narrativePages + 2) / 2);
}

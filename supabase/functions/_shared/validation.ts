/**
 * Validation utilities for Lore Reactions Edge Function
 */

export const VALID_KINDS = [
  'imperial_loyalty',
  'mana_corruption',
  'inquisitorial_alert',
  'consumed_by_void',
] as const;

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateVisitorId(visitorId: string | null): { valid: boolean; error?: string } {
  if (!visitorId) return { valid: false, error: 'MISSING_VISITOR_ID' };
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!visitorId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
    return { valid: false, error: 'INVALID_VISITOR_ID' };
  }
  return { valid: true };
}

export function validateIdempotencyKey(key: string): { valid: boolean; error?: string } {
  if (!key) return { valid: false, error: 'MISSING_IDEMPOTENCY_KEY' };
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!key.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
    return { valid: false, error: 'INVALID_IDEMPOTENCY_KEY' };
  }
  return { valid: true };
}

export function validateKind(kind: string): { valid: boolean; error?: string } {
  if (!kind) return { valid: false, error: 'MISSING_KIND' };
  const validKinds = ['imperial_loyalty', 'mana_corruption', 'inquisitorial_alert', 'consumed_by_void'];
  if (!['imperial_loyalty', 'mana_corruption', 'inquisitorial_alert', 'consumed_by_void'].includes(kind)) {
    return { valid: false, error: 'INVALID_KIND' };
  }
  return { valid: true };
}

export function validateChapterId(chapterId: string): { valid: boolean; error?: string } {
  if (!chapterId) return { valid: false, error: 'MISSING_CHAPTER_ID' };
  const validChapters = [
    'chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5',
    'chapter-6', 'chapter-7', 'chapter-8', 'chapter-9', 'chapter-10'
  ];
  if (!['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5',
    'chapter-6', 'chapter-7', 'chapter-8', 'chapter-9', 'chapter-10'].includes(chapterId)) {
    return { valid: false, error: 'INVALID_CHAPTER_ID' };
  }
  return { valid: true };
}
/**
 * Shared types for Lore Reactions Edge Function
 */

export interface SubmitRequest {
  chapter_id: string;
  kind: string;
  idempotency_key: string;
}

export interface SubmitResponse {
  success: boolean;
  chapter_id?: string;
  kind?: string;
  count?: number;
  counts?: Record<string, number>;
  error?: string;
  retryAfter?: number;
}

export interface SubmitPayload {
  chapter_id: string;
  kind: string;
  user_hash: string;
  idempotency_key: string;
}

export type LoreReactionKind =
  | 'imperial_loyalty'
  | 'mana_corruption'
  | 'inquisitorial_alert'
  | 'consumed_by_void';

export interface LoreReactionPayload {
  chapter_id: string;
  kind: string;
  user_hash: string;
  idempotency_key: string;
}
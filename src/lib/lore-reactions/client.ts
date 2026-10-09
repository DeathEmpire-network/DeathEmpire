/**
 * Lore Reactions - Client
 * Cliente para leer contadores y enviar reacciones via endpoint propio (Edge Function).
 * No contiene secretos, IP, service role ni lógica de Upstash.
 */

import type { LoreReactionCounts, LoreReactionKind, LoreReactionSubmitResult } from '@deathempire/types/lore-reactions';

const LORE_REACTION_KINDS: readonly LoreReactionKind[] = [
  'imperial_loyalty',
  'mana_corruption',
  'inquisitorial_alert',
  'consumed_by_void',
] as const;

const VISITOR_ID_KEY = 'deathempire:lore-reactions:visitor-id';

function getFunctionUrl(): string {
  const url = import.meta.env.PUBLIC_LORE_REACTIONS_FUNCTION_URL;
  if (!url) {
    throw new Error('PUBLIC_LORE_REACTIONS_FUNCTION_URL is not configured');
  }
  return url;
}

function getVisitorId(): string {
  let id = localStorage.getItem('deathempire:lore-reactions:visitor-id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('deathempire:lore-reactions:visitor-id', id);
  }
  return id;
}

export async function getReactionCounts(chapterSlug: string): Promise<Record<string, number>> {
  try {
    const response = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/rest/v1/lore_reaction_counts?chapter_id=eq.${encodeURIComponent(chapterSlug)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'apikey': import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
        'Authorization': `Bearer ${import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) return getDefaultCounts();
      throw new Error(`Failed to fetch counts: ${response.status}`);
    }

    const data = await response.json();
    return { ...getDefaultCounts(), ...Object.fromEntries(data.map((row: any) => [row.kind, row.count])) };
  } catch {
    return getDefaultCounts();
  }
}

export async function submitReaction(
  chapterSlug: string,
  kind: LoreReactionKind
): Promise<LoreReactionSubmitResult> {
  if (!LORE_REACTION_KINDS.includes(kind)) {
    return { success: false, error: 'INVALID_KIND' };
  }

  const functionUrl = getFunctionUrl();
  const visitorId = getVisitorId();
  const idempotencyKey = crypto.randomUUID();

  try {
    const response = await fetch(`${functionUrl}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-de-visitor-id': visitorId,
      },
      body: JSON.stringify({
        chapter_id: chapterSlug,
        kind,
        idempotency_key: idempotencyKey,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        return { success: false, error: 'RATE_LIMITED', retryAfter: data.retryAfter };
      }
      if (response.status === 409) {
        return { success: false, error: 'IDEMPOTENCY_CONFLICT' };
      }
      if (response.status === 503) {
        return { success: false, error: 'SERVICE_UNAVAILABLE' };
      }
      return { success: false, error: data.error || 'SUBMIT_FAILED' };
    }

    return { success: true, counts: data.counts };
  } catch {
    return { success: false, error: 'NETWORK_ERROR' };
  }
}

function getDefaultCounts(): Record<string, number> {
  return {
    imperial_loyalty: 0,
    mana_corruption: 0,
    inquisitorial_alert: 0,
    consumed_by_void: 0,
  };
}
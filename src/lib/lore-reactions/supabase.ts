/**
 * Lore Reactions - Supabase Service (Live)
 * Implementación real del servicio usando Supabase.
 * Solo lectura de vista pública; escritura via endpoint/Edge Function.
 */

import type {
  LoreReactionCounts,
  LoreReactionPayload,
  LoreReactionSubmitResult,
  LoreReactionAvailability,
} from '@deathempire/types/lore-reactions';
import type { LoreReactionServiceContract } from './contracts';
import { createClient } from '@supabase/supabase-js';
import { getDefaultCounts } from '@deathempire/types/lore-reactions';

let _supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!_supabaseClient) {
    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (url && key) {
      _supabaseClient = createClient(url, key);
    }
  }
  return _supabaseClient;
}

export class SupabaseLoreReactionService implements LoreReactionServiceContract {
  readonly isAvailable = true;
  readonly availability: LoreReactionAvailability = {
    available: true,
    service: 'supabase',
    reason: 'configured',
    serviceType: 'supabase',
  };

  async getCounts(chapterSlug: string): Promise<LoreReactionCounts> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return getDefaultCounts();
    }

    try {
      const { data, error } = await supabase
        .from('lore_reaction_counts')
        .select('kind, count')
        .eq('chapter_id', chapterSlug);

      if (error) {
        console.warn('[SupabaseLoreReactionService] Error fetching counts:', error);
        return getDefaultCounts();
      }

      const counts = getDefaultCounts();
      type ReactionCountRow = { kind: string; count: number };
      for (const row of (data as ReactionCountRow[]) ?? []) {
        counts[row.kind] = row.count;
      }
      return counts;
    } catch {
      return getDefaultCounts();
    }
  }

  async submitReaction(payload: LoreReactionPayload): Promise<LoreReactionSubmitResult> {
    // Este servicio NO hace submit directo.
    // El submit se hace via endpoint/Edge Function.
    // Este método existe para cumplir la interfaz pero lanza error si se usa directo.
    return {
      success: false,
      error: 'SUBMIT_NOT_ALLOWED',
    };
  }
}
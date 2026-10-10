/**
 * LoreReactions.ts - Lógica del componente de reacciones
 * Export: initLoreReactions()
 */
import { getReactionCounts, submitReaction } from '../../lib/lore-reactions/client';
// @ts-ignore
import { LORE_REACTION_KINDS } from '@deathempire/types/lore-reactions';

export function initLoreReactions() {
  const container = document.querySelector('.lore-reactions');
  if (!container) return;

  const chapterSlug = container.getAttribute('data-chapter-slug') || '';
  const lang = container.getAttribute('data-lang') || 'en';
  const isLive = true;

  const grid = container.querySelector('.lore-reactions__grid');
  const footer = container.querySelector('.lore-reactions__footer');
  const headerNotice = container.querySelector('.lore-reactions__notice');
  const title = container.querySelector('.lore-reactions__title');

  function updateUI(newCounts) {
    if (grid) {
      grid.querySelectorAll('button').forEach((btn) => {
        const kind = btn.getAttribute('data-reaction-kind');
        if (kind && newCounts[kind] !== undefined) {
          const countEl = btn.querySelector('.lore-reactions__count');
          if (countEl) countEl.textContent = String(newCounts[kind]);
          const labelEl = btn.querySelector('.lore-reactions__label');
          const emojiEl = btn.querySelector('.lore-reactions__emoji');
          const label = labelEl?.textContent || '';
          const emoji = emojiEl?.textContent || '';
          btn.setAttribute('aria-label', `${emoji} ${label}: ${newCounts[kind]}`);
        }
      });
    }
  }

  function setEnabled() {
    if (grid) {
      grid.querySelectorAll('button').forEach((btn) => {
        (btn).disabled = false;
        btn.classList.remove('lore-reactions__button--disabled');
        btn.setAttribute('aria-disabled', 'false');
      });
    }
    if (footer) footer.style.display = 'none';
    if (headerNotice) headerNotice.style.display = 'none';
    if (title) title.textContent = lang === 'es' ? 'Reacciones' : 'Reactions';
  }

  async function loadCounts() {
    if (!isLive) return;
    try {
      const data = await getReactionCounts(chapterSlug);
      updateUI(data);
      setEnabled();
    } catch {
      // Silent fail - keep fallback state
    }
  }

  async function handleReact(kind) {
    if (!isLive) return;
    try {
      const result = await submitReaction(chapterSlug, kind);
      if (result.success && result.counts) {
        updateUI(result.counts);
      }
    } catch {
      // Silent fail
    }
  }

  // Bind click events on reaction buttons
  if (grid) {
    grid.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const kind = btn.getAttribute('data-reaction-kind');
        if (kind) handleReact(kind);
      });
    });
  }

  loadCounts();
}
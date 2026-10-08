-- Lore Reactions - Esquema SQL Propuesto (Fase 2)
-- Para aplicar en Supabase Dashboard > SQL Editor
-- NO ejecutar en Fase 1 - solo documentación

-- ============================================================
-- Tabla principal: reacciones individuales (idempotentes)
-- ============================================================
CREATE TABLE IF NOT EXISTS lore_reactions (
  id BIGSERIAL PRIMARY KEY,
  chapter_slug TEXT NOT NULL,
  reaction_kind TEXT NOT NULL,
  user_id UUID NOT NULL,                    -- Supabase Auth UUID
  idempotency_key TEXT NOT NULL UNIQUE,     -- Clave única por usuario+capítulo+tipo
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_lore_reactions_chapter
  ON lore_reactions (chapter_slug);

CREATE INDEX IF NOT EXISTS idx_lore_reactions_user_chapter_kind
  ON lore_reactions (user_id, chapter_slug, reaction_kind);

CREATE INDEX IF NOT EXISTS idx_lore_reactions_idempotency
  ON lore_reactions (idempotency_key);

-- Constraint: solo kinds válidos
ALTER TABLE lore_reactions
  ADD CONSTRAINT chk_lore_reactions_kind
  CHECK (reaction_kind IN (
    'imperial_loyalty',
    'mana_corruption',
    'inquisitorial_alert',
    'consumed_by_void'
  ));

-- ============================================================
-- Vista agregada: contadores por capítulo (lectura pública)
-- ============================================================
CREATE OR REPLACE VIEW lore_reaction_counts AS
SELECT
  chapter_slug,
  reaction_kind,
  COUNT(*) AS count
FROM lore_reactions
GROUP BY chapter_slug, reaction_kind;

-- Permiso de lectura pública en la vista
GRANT SELECT ON lore_reaction_counts TO anon, authenticated;

-- ============================================================
-- Función RPC para escritura segura (idempotente)
-- ============================================================
CREATE OR REPLACE FUNCTION submit_lore_reaction(
  p_chapter_slug TEXT,
  p_reaction_kind TEXT,
  p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_user_id UUID := auth.uid();
BEGIN
  -- Validación de entrada
  IF p_chapter_slug IS NULL OR p_reaction_kind IS NULL OR p_idempotency_key IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'INVALID_INPUT',
      'message', 'Missing required parameters'
    );
  END IF;

  -- Validar kind
  IF p_reaction_kind NOT IN (
    'imperial_loyalty',
    'mana_corruption',
    'inquisitorial_alert',
    'consumed_by_void'
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'INVALID_KIND',
      'message', 'Invalid reaction kind'
    );
  END IF;

  -- Validar usuario autenticado
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'UNAUTHENTICATED',
      'message', 'Authentication required'
    );
  END IF;

  -- Inserción idempotente (ON CONFLICT DO NOTHING)
  INSERT INTO lore_reactions (chapter_slug, reaction_kind, user_id, idempotency_key)
  VALUES (p_chapter_slug, p_reaction_kind, v_user_id, p_idempotency_key)
  ON CONFLICT (idempotency_key) DO NOTHING;

  -- Retornar contadores actualizados
  RETURN (
    SELECT jsonb_build_object(
      'success', true,
      'counts', jsonb_object_agg(reaction_kind, count)
    )
    FROM lore_reaction_counts
    WHERE chapter_slug = p_chapter_slug
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', 'INTERNAL_ERROR',
    'message', SQLERRM
  );
END;
$$;

-- Permiso de ejecución para usuarios autenticados
GRANT EXECUTE ON FUNCTION submit_lore_reaction(TEXT, TEXT, TEXT) TO authenticated;

-- ============================================================
-- Trigger para updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_lore_reactions_updated_at
  BEFORE UPDATE ON lore_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Comentarios de documentación
-- ============================================================
COMMENT ON TABLE lore_reactions IS 'Reacciones idempotentes por usuario/capítulo/tipo (Fase 2+)';
COMMENT ON COLUMN lore_reactions.idempotency_key IS 'Clave única: userId:chapterSlug:kind (SHA-256 recomendado)';
COMMENT ON VIEW lore_reaction_counts IS 'Contadores agregados públicos por capítulo/tipo';
COMMENT ON FUNCTION submit_lore_reaction IS 'RPC seguro: escritura idempotente con validación de auth y kind';
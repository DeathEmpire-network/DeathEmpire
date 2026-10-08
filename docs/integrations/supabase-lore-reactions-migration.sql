-- ============================================================
-- DeathEmpire — Supabase Migration: Lore Reactions (Fase 2)
-- Infraestructura para reacciones temáticas del Libro del Lore
-- ============================================================
-- Aplicar en Supabase Dashboard > SQL Editor
-- O vía CLI: supabase db push --include-all
-- ============================================================

-- ============================================================
-- 1. ENUM / TIPO para kinds válidos (opcional, usa CHECK)
-- ============================================================
-- Se usa CHECK constraint en la tabla para validar kind

-- ============================================================
-- 2. TABLA PRINCIPAL: lore_reactions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lore_reactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id      TEXT NOT NULL,
    kind            TEXT NOT NULL,
    user_hash       TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    idempotency_key TEXT NOT NULL UNIQUE
);

-- Constraint: solo kinds válidos
ALTER TABLE public.lore_reactions
    ADD CONSTRAINT chk_lore_reactions_kind
    CHECK (kind IN (
        'imperial_loyalty',
        'mana_corruption',
        'inquisitorial_alert',
        'consumed_by_void'
    ));

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_lore_reactions_chapter_kind
    ON public.lore_reactions (chapter_id, kind);

CREATE INDEX IF NOT EXISTS idx_lore_reactions_user_created
    ON public.lore_reactions (user_hash, created_at DESC);

-- ============================================================
-- 3. VISTA AGREGADA: lore_reaction_counts (lectura pública)
-- ============================================================
CREATE OR REPLACE VIEW public.lore_reaction_counts AS
SELECT
    chapter_id,
    kind,
    COUNT(*) AS count
FROM public.lore_reactions
GROUP BY chapter_id, kind;

-- Permiso de lectura pública en la vista
GRANT SELECT ON public.lore_reaction_counts TO anon, authenticated;

-- ============================================================
-- 4. FUNCIÓN RPC: submit_lore_reaction (escritura idempotente)
-- ============================================================
CREATE OR REPLACE FUNCTION public.submit_lore_reaction(
    p_chapter_id       TEXT,
    p_kind             TEXT,
    p_user_hash        TEXT,
    p_idempotency_key  TEXT
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
    -- 1. Validar entrada básica
    IF p_chapter_id IS NULL OR p_kind IS NULL OR p_idempotency_key IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_INPUT',
            'message', 'Missing required parameters: chapter_id, kind, idempotency_key'
        );
    END IF;

    -- 2. Validar kind permitido
    IF p_kind NOT IN (
        'imperial_loyalty',
        'mana_corruption',
        'inquisitorial_alert',
        'consumed_by_void'
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_KIND',
            'message', 'Invalid reaction kind: ' || p_kind
        );
    END IF;

    -- 3. Validar usuario autenticado
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'UNAUTHENTICATED',
            'message', 'Authentication required to submit reactions'
        );
    END IF;

    -- 4. Validar user_hash corresponde al usuario autenticado (opcional, defensa en profundidad)
    -- En Fase 2 el user_hash se genera en servidor; aquí solo validamos formato
    IF p_user_hash IS NULL OR p_user_hash = '' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_USER_HASH',
            'message', 'Invalid user hash'
        );
    END IF;

    -- 5. Inserción idempotente (ON CONFLICT DO NOTHING por idempotency_key único)
    INSERT INTO public.lore_reactions (chapter_id, kind, user_hash, idempotency_key)
    VALUES (p_chapter_id, p_kind, p_user_hash, p_idempotency_key)
    ON CONFLICT (idempotency_key) DO NOTHING;

    -- 6. Retornar contadores actualizados para ese capítulo
    SELECT jsonb_build_object(
        'success', true,
        'chapter_id', p_chapter_id,
        'kind', p_kind,
        'count', (
            SELECT COUNT(*)
            FROM public.lore_reactions
            WHERE chapter_id = p_chapter_id AND kind = p_kind
        )
    ) INTO v_result;

    RETURN v_result;

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', 'INTERNAL_ERROR',
        'message', SQLERRM
    );
END;
$$;

-- Permiso de ejecución para usuarios autenticados
GRANT EXECUTE ON FUNCTION public.submit_lore_reaction(TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- 5.1 Habilitar RLS en tabla principal
ALTER TABLE public.lore_reactions ENABLE ROW LEVEL SECURITY;

-- 5.2 Política: DENEGAR SELECT a anon (cliente no lee filas crudas)
CREATE POLICY rls_lore_reactions_deny_anon_select
    ON public.lore_reactions
    FOR SELECT
    TO anon
    USING (false);

-- 5.3 Política: authenticated puede ver SOLO sus propias reacciones (opcional, para historial)
CREATE POLICY rls_lore_reactions_select_own
    ON public.lore_reactions
    FOR SELECT
    TO authenticated
    USING (user_hash = current_setting('app.current_user_hash', true));

-- 5.4 INSERT/UPDATE/DELETE: DENEGADOS para roles cliente (solo vía RPC)
-- No se crean policies INSERT/UPDATE/DELETE para authenticated/anon
-- El RPC usa SECURITY DEFINER y tiene permisos de escritura

-- 5.5 Vista pública: SELECT permitida para todos
ALTER VIEW public.lore_reaction_counts SET (security_invoker = true);
GRANT SELECT ON public.lore_reaction_counts TO anon, authenticated;

-- ============================================================
-- 6. GRANTS ADICIONALES
-- ============================================================
-- RPC ya tiene GRANT EXECUTE TO authenticated (arriba)
-- Vista ya tiene GRANT SELECT TO anon, authenticated (arriba)

-- ============================================================
-- 7. COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================
COMMENT ON TABLE public.lore_reactions IS
    'Reacciones idempotentes por usuario/capítulo/tipo (Fase 2+). user_hash = hash anónimo (IP+UA+salt).';

COMMENT ON COLUMN public.lore_reactions.idempotency_key IS
    'Clave única: sha256(user_id:chapter_id:kind) o similar. Garantiza idempotencia.';

COMMENT ON VIEW public.lore_reaction_counts IS
    'Contadores agregados públicos por capítulo/tipo. Lectura pública sin auth.';

COMMENT ON FUNCTION public.submit_lore_reaction(TEXT, TEXT, TEXT, TEXT) IS
    'RPC seguro: escritura idempotente con validación de auth, kind y idempotency_key.';

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================

-- ============================================================
-- VERIFICACIÓN POST-APLICACIÓN (ejecutar manualmente)
-- ============================================================
-- SELECT * FROM public.lore_reactions LIMIT 0;
-- SELECT * FROM public.lore_reaction_counts;
-- SELECT public.submit_lore_reaction('chapter-1', 'imperial_loyalty', 'test_hash', 'test_key_123');
-- Verificar en Dashboard > Authentication > Policies que RLS está activo
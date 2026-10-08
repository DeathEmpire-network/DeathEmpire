# Lore Reactions - Políticas RLS Propuestas (Fase 2)

## Principios de Seguridad

1. **Lectura pública agregada**: Cualquiera (anon) puede leer contadores por capítulo/tipo
2. **Escritura autenticada**: Solo usuarios logueados pueden reaccionar
3. **Sin lectura individual**: Nadie puede leer reacciones de otros usuarios
4. **Sin edición/borrado cliente**: Solo RPC/Edge Function puede escribir
5. **Service role solo servidor**: Operaciones admin solo vía service role

---

## Tablas y Vistas

### `lore_reactions` (tabla principal)
| Política | Rol | Operación | Condición |
|----------|-----|-----------|-----------|
| `rls_lore_reactions_select_anon` | `anon` | `SELECT` | **DENEGADA** - vista pública en su lugar |
| `rls_lore_reactions_select_auth` | `authenticated` | `SELECT` | `user_id = auth.uid()` (propia reacción) |
| `rls_lore_reactions_insert_auth` | `authenticated` | `INSERT` | Via RPC `submit_lore_reaction` únicamente |
| `rls_lore_reactions_update` | `authenticated` | `UPDATE` | **DENEGADA** |
| `rls_lore_reactions_delete` | `authenticated` | `DELETE` | **DENEGADA** |

### `lore_reaction_counts` (vista agregada)
| Política | Rol | Operación | Condición |
|----------|-----|-----------|-----------|
| `rls_lore_counts_select_all` | `anon`, `authenticated` | `SELECT` | **PERMITIDA** (pública) |

---

## SQL de Políticas RLS

```sql
-- Habilitar RLS en tabla principal
ALTER TABLE lore_reactions ENABLE ROW LEVEL SECURITY;

-- 1. DENEGAR SELECT a anon (fuerza uso de vista pública)
CREATE POLICY rls_lore_reactions_deny_anon_select
  ON lore_reactions
  FOR SELECT
  TO anon
  USING (false);

-- 2. authenticated puede ver SOLO sus propias reacciones
CREATE POLICY rls_lore_reactions_select_own
  ON lore_reactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 3. INSERT solo vía RPC (policy por defecto deniega INSERT)
-- No crear policy INSERT para authenticated - solo RPC con SECURITY DEFINER

-- 4. DENEGAR UPDATE/DELETE a todos los roles cliente
CREATE POLICY rls_lore_reactions_deny_update
  ON lore_reactions
  FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY rls_lore_reactions_deny_delete
  ON lore_reactions
  FOR DELETE
  TO authenticated
  USING (false);

-- 5. Vista pública: SELECT permitida para todos
ALTER VIEW lore_reaction_counts SET (security_invoker = true);
GRANT SELECT ON lore_reaction_counts TO anon, authenticated;
```

---

## RPC `submit_lore_reaction` - Seguridad

La función RPC `submit_lore_reaction` se ejecuta con `SECURITY DEFINER` (privilegios del creador, típicamente `postgres` o role con permisos de escritura).

**Validaciones internas:**
1. Usuario autenticado (`auth.uid() IS NOT NULL`)
2. `reaction_kind` en lista permitida
2. `idempotency_key` única (constraint UNIQUE)
3. Usuario no puede sobrescribir reacción de otro (constraint UNIQUE en `idempotency_key` incluye `user_id` implícito)

**Ejemplo de invocación desde cliente:**
```typescript
const { data, error } = await supabase.rpc('submit_lore_reaction', {
  p_chapter_slug: 'chapter-1',
  p_reaction_kind: 'imperial_loyalty',
  p_idempotency_key: 'sha256(userId:chapter-1:imperial_loyalty)'
});
```

---

## Service Role - Solo Servidor

Operaciones que requieren `service_role` (solo en Edge Functions / Serverless Functions):
- Moderación: borrar reacciones spam/abusivas
- Analytics: queries agregadas complejas
- Backfill/migraciones

**NUNCA** exponer `service_role` en cliente ni variables `PUBLIC_*`.

---

## Checklist de Aplicación (Fase 2)

- [ ] Ejecutar `supabase-lore-reactions-schema.sql` en Supabase Dashboard
- [ ] Verificar políticas RLS en Dashboard > Authentication > Policies
- [ ] Probar RPC `submit_lore_reaction` con usuario autenticado
- [ ] Verificar que `anon` NO puede leer `lore_reactions`
- [ ] Verificar que `anon` SÍ puede leer `lore_reaction_counts`
- [ ] Verificar idempotencia: misma `idempotency_key` no duplica
- [ ] Verificar que usuario A no ve reacciones de usuario B
- [ ] Auditar logs de Supabase para accesos denegados
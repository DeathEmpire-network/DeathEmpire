## What
Visual and accessibility refinements for the DeathEmpire site:

- **Color palette**: warmer, lighter theme for better readability across light/dark contexts
- **Focus-visible**: enhanced outlines for links, buttons, and role="button" elements (gold-bright, 3px offset, box-shadow)
- **Reduced-motion**: disables transforms/animations, forces auto scroll-behavior
- **Layout safety**: `overflow-x: hidden` on html/body prevents horizontal scroll
- **BookReader UX**: increased height clamp (640px-840px), scrollable leaf-inner with custom scrollbar styling
- **Cleanup**: removed obsolete E2E tests (book-geometry.spec.ts, example.spec.ts)

## Risk
Low: purely visual/accessibility, no functional changes to BookReader logic, no Supabase/infra changes.

## Review
- `src/styles/global.css` — color tokens, focus-visible, reduced-motion, overflow-x
- `src/components/BookReader.astro` — height clamp, scrollable leaf-inner
- `e2e/` — removed obsolete test files

## Validation
- Build: 44 pages ✅
- Astro check: 0 errors ✅
- E2E audit: 5/5 passed ✅

Reviewer: @Anresku
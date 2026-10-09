refactor(site): visual refinements and accessibility improvements

- Color palette: warmer, lighter theme for better readability
- Focus-visible: enhanced outlines for links, buttons, and role="button" elements (gold-bright, 3px offset, box-shadow)
- Reduced-motion: disables transforms/animations, forces auto scroll-behavior
- Layout safety: overflow-x: hidden on html/body prevents horizontal scroll
- BookReader: increased height clamp (640px-840px), scrollable leaf-inner with custom scrollbar styling
- Cleanup: removed obsolete E2E tests (book-geometry.spec.ts, example.spec.ts)
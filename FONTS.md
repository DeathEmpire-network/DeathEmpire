# Web Typography

The site uses a small, locally hosted type system. Keep active font files in `src/assets/fonts` so Vite resolves them consistently in development and production; the broader collection in `fonts/` is an unbundled source archive.

## Roles

- **Cinzel** (`--font-display`): brand wordmark, headings, book titles, and short ceremonial labels. Avoid it for paragraphs or dense navigation.
- **EB Garamond** (`--font-body`): paragraphs, lore pages, descriptions, and editorial copy. Use its italic face for subtitles and quotations.
- **Crimson Text** (`--font-reading`): book reading text (body paragraphs in BookReader), long-form narrative. Use its italic for emphasis within reading flow.
- **Montserrat** (`--font-ui`): navigation, buttons, status badges, and compact interface labels. Keep small text at a readable size; use uppercase sparingly.
- **System monospace** (`--font-mono`): code and technical identifiers only.

## Adding Fonts

1. Prefer variable web fonts and place only the required files in `src/assets/fonts/`.
2. Declare each face in `src/styles/global.css` with its correct weight/style range and a relative URL to `../assets/fonts/`.
3. Keep the font's OFL license in `public/fonts/` so it is included in the static site. Do not load unused families or static weights when a variable face covers the required range.
4. Assign elements through the shared `--font-*` tokens. Do not add one-off font-family declarations to page components unless the design calls for a deliberate exception.

## Current Assets

- `cinzel-variable.ttf` with `OFL-Cinzel.txt`
- `eb-garamond-variable.ttf` and `eb-garamond-italic-variable.ttf` with `OFL-EB-Garamond.txt`
- `montserrat-variable.ttf` with `OFL-Montserrat.txt`

Other supplied families remain in `fonts/` as unbundled options and are not downloaded by visitors.

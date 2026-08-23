# V43 changes

Built from the user's locally edited V42 folder uploaded on Aug. 22/23, 2026. Local edits were preserved as the baseline.

## Homepage
- Added a full-width, roughly one-inch-tall colorful aura divider directly below the hero.
- Preserved the mouse-following hero aura and existing hero copy/links.
- Increased typography scale across section headings, project names, experience names, body copy, and case-study headings.
- Kept `Learn more ↗` as the project and linked-experience CTA language.

## About + film photography
- Removed the standalone Photography route/page and its old gallery assets.
- Removed the separate `Check out my pics →` CTA.
- Made only the words `film photos` in the About paragraph interactive.
- Added the small hover/focus hint `click to see my photos`.
- Clicking `film photos` swaps the headshot frame into a 10-photo film viewer.
- Added previous/next arrows, `01 / 10` counter, keyboard arrow support, Escape-to-close, and a close button.
- Gallery images use `object-fit: contain` so film compositions are not cropped.
- On desktop the headshot/gallery frame stretches to the full height of the About copy column; mobile returns to a normal portrait ratio.
- Added the clean Hawaii banana-farm image and the user-selected film photos to the inline viewer.

## Visual cleanup
- Reduced visible card/container treatment in case-study fact and decision grids; spacing and typography carry more hierarchy.
- Simplified the Accenture workflow treatment so it reads more like a continuous systems artifact and less like a row of UI cards.
- Made Fun Builds more visually expressive than the professional work through project-specific pastel surfaces, softer depth, and a subtle stagger on the smaller builds.
- Preserved existing logo-following hover glow, expandable artifact images, skeleton/loading behavior, reveal motion, and the persistent back-to-top control.

## Copy cleanup
- Reduced repeated portfolio-language patterns such as `translated X into Y` where plain language was clearer.
- Preserved detailed evidence, technical context, constraints, metrics, and implementation detail rather than shortening the case studies for the sake of brevity.

## Validation
- TSX syntax/transpile check passed with TypeScript `transpileModule`.
- All 41 local asset references in `src/main.tsx` resolve to files in `public/`.
- All 10 About film-viewer JPEGs are present.
- `public/resume.pdf` is present and is the current May 2027 resume asset from the local V42 baseline.
- A full Vite build could not be executed in the Linux packaging container because the uploaded `node_modules` directory contains macOS Rollup binaries. This is an environment mismatch, not a source error; install dependencies locally on Node 22 before running `npm run build`.

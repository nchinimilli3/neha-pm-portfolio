# V18 — full picky/detail pass

This is the polish pass built on V17. It preserves the pointer-based scheduler drag behavior and all prior case-study/content work.

## Visual system
- Standardized card radii, spacing, shadows, typography rhythm, and hover lift.
- Tightened 13-inch laptop layouts and created deliberate mobile behavior rather than only shrinking desktop.
- Slowed and softened the page-wide aura; reduced cursor response and added subtle pulse variation.
- Normalized company-logo containers and technical-project card spacing.
- Refined photo crops, overlays, image motion, and project preview proportions.

## Navigation / interaction
- Added stronger keyboard focus states and made project cards keyboard-openable.
- Kept navigation conventional and sticky on mobile, with horizontal overflow rather than broken wrapping.
- Case studies now return to the user's previous homepage scroll position when closed.
- Added Safari `-webkit-backdrop-filter` fallbacks.

## Scheduler
- Preserved V17 pointer drag: drag empty cells to paint; start another drag on the same selected state to erase.
- Added primary-pointer guards, drag cursor state, note indicators, and horizontal calendar protection on small screens.
- Share/Discord/email controls now copy usable demo text; calendar export downloads an `.ics` file.
- Improved control spacing, hover/active feedback, and mobile action-row scrolling.

## Case studies
- Standardized heading/body widths and section rhythm.
- Improved image sizing and progression layouts.
- Kept real evidence immediately after opening a project and reduced redundant visual density.

## Accessibility / metadata / performance
- Added `focus-visible` treatment, `aria-pressed` on availability cells, and reduced-motion handling.
- Lazy-loaded below-the-fold images and marked the first Ford cover as the eager/LCP image.
- Fixed favicon / Apple icon paths for GitHub Pages base paths.
- Added Safari pinned-tab icon and social preview metadata/artwork.
- Removed the redundant About section; footer now exposes Email, LinkedIn, and Resume directly.

## Validation
- TypeScript TSX transpilation syntax check: 0 diagnostics.
- Local asset-reference check: all local `src`/`href` files resolve.
- Full Vite build could not be run in this environment because npm packages are not available offline.

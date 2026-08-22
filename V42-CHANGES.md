# V42 working changes

## Homepage / project cards
- Accenture project summary now begins with “Translated” instead of “Turned.”
- Commute homepage and case-study preview use a corrected static capture with the app screen and tab bar fully contained inside the iPhone frame.
- Spartan Touchdown copy expanded with CSE 335, C++, wxWidgets, shared requirements/constraints, implementation split, 2D graphics/assets, integration, and testing.
- Stable Fluids copy expanded with CSE 472, C++, Stable Fluids/Stam method, advection, diffusion/viscosity, buoyancy, grid-based density/velocity fields, interactive emitters/obstacles, and real-time rendering.

## About
- Rewrote About copy as one cohesive, grounded story with a light personal line rather than generic product language.
- Preserved reading/reality-TV hover content, hobbies, photography CTA, and book recommendation form.
- Centered the photo + copy composition within the page while keeping paragraph text readable/left-aligned.

## Commute case study
- Tool-logo hover is now a drop-shadow glow attached to the actual logo silhouette; removed the rectangular hover background/pseudo-element.
- Routine onboarding gets a specificity-safe internal scroll so all routine rows, total, and Continue button are reachable inside the phone.
- Today screen date is generated from the visitor’s browser-local date on page load.
- Static Commute capture was recomposed so the screen/tab bar no longer sit outside the hardware frame; image is always contained rather than cropped/stretched.

## Photography / navigation / experience / chat follow-up
- Photography page now scrolls to the top in a layout effect before paint, removing the visible bottom-to-top jump when opened from the About section.
- Gallery stage sizing tightened: portrait photos are capped to roughly 68% of viewport height on desktop and 64% on mobile; landscape photos are narrower so an entire frame is easier to see without scrolling.
- Active gallery images and filmstrip thumbnails load eagerly and use one shared asset resolver across every collection.
- Re-encoded all gallery JPEG assets to browser-friendly, orientation-normalized baseline RGB JPEGs and reduced oversized originals so non-Tahoe collections follow the same lightweight loading pattern that was already reliable in Tahoe.
- Added a small fixed back-to-top arrow to every long page; it appears after scrolling and stays available in the lower-right corner.
- Arc of Indiana engagement duration corrected to five weeks.
- Added case-study links inside the expanded Accenture, Ford Credit, and Ford experience entries.
- iMessage recreation now opens a six-option Tapback picker on double-click instead of automatically adding a heart.
- Reframed the iMessage case study around the CSE 477 base assignment (real-time room + join/leave), the choice to recreate iMessage, added typing/reaction states, and the HTML/CSS/JavaScript + Socket.IO implementation.

- Added a soft cursor-following aura bloom to the homepage hero (desktop pointer only; no glass/bouncy cursor effect).
- Added a natural line to About about caring how the things I build look, not only whether they work.

- About: replaced copy with user-provided grounded version; “Commute iOS app” is now a subtle inline link to #/projects/commute.

## Final V42 follow-up
- Resume asset replaced with the current May 2027 PM-oriented resume; header, hero, and footer all resolve to `resume.pdf`.
- Project and experience case-study CTA wording standardized to “Learn more ↗”.
- About copy replaced with the final user-provided version and the inline Commute mention links subtly to the Commute case study.
- Verified all 41 photography JPEGs decode successfully and all local assets referenced by `src/main.tsx` exist in `public/`.
- TypeScript/TSX syntax validation passed using local type stubs because package installation was unavailable in the execution environment.

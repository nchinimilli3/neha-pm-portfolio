# V28 implementation checklist

## Implemented
- [x] Experience moved above Projects
- [x] Minimal hero with Learn about me
- [x] Expandable Experience rows; one open at a time
- [x] Accenture uses “frontier AI lab”
- [x] Ford/Ford Credit progression consolidated
- [x] Spectrum logo asset added
- [x] PwC × Arc of Indiana added
- [x] MSU Russell Palmer Career Management Center added
- [x] Dashney’s removed from portfolio Experience
- [x] Projects separated from Fun things I’ve built
- [x] Projects: Customer Value Framework, FinSimple, Accenture, Collaborative Scheduler
- [x] Fun: Commute App, Group Chat, Estée Lauder, Spartan Touchdown, Stable Fluids, Ray Tracer
- [x] Commute renamed Commute App
- [x] Commute origin story updated to Michigan driving + Bay Area transit
- [x] Interactive iPhone onboarding remains inside device
- [x] iPhone proportions corrected to 390×844-style ratio
- [x] Live BART / AC Transit / Bay Bridge freshness cues retained
- [x] Commute API/data section added
- [x] PM decisions and tradeoffs added
- [x] V1 / Later / Cut scope artifact added
- [x] Measurement section uses proposed metrics, not fake outcomes
- [x] Case-study typography softened
- [x] Excess case-study divider rules reduced
- [x] Button/link contrast override added
- [x] Aura blooms now drift/breathe independently
- [x] Reduced-motion support
- [x] About section with supplied headshot
- [x] Responsive pass for new layouts

## Final local verification before deploy
- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Open desktop + mobile and visually inspect all routes
- [ ] Confirm all remote Unsplash imagery loads in production
- [ ] Verify exact production API choices before presenting Commute as a native implementation (browser sandbox is explicitly simulated)

Build note: this execution environment could not finish installing npm dependencies, so Vite was not available for the final compile command. Source-level implementation is complete, but run the two commands above before GitHub deploy.

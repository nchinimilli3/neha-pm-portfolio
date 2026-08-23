# V30 audit closure checklist

The 100-point V29 audit was used as the implementation checklist. V30 closes or materially addresses every code/content item that can be handled in the source package.

## Product correctness
- [x] One Commute scenario clock instead of a 9:41 contradiction
- [x] Wake/leave/vehicle/arrival times derive from one state model
- [x] Sleep-later choices respect a minimum routine and disable impossible states
- [x] BART / NL / traffic freshness are independent
- [x] Route explanations are recommendation-specific
- [x] Demo logic is explicitly rule-based rather than statistical confidence
- [x] Weather has a real effect in the sandbox
- [x] Driving is explicitly Later, not implied as V1
- [x] History/learning surface added
- [x] Settings replaces generic More

## Permissions / native behavior
- [x] Health, Calendar, Location, and Notifications use one simulated iOS permission pattern
- [x] Calendar scope is explained
- [x] Location use is explained
- [x] Notifications and alarm-change policy are separated
- [x] Health shows standard vs personalized walk estimate
- [x] Onboarding includes name and generic demo origin
- [x] Onboarding is correctly numbered 1 of 6
- [x] Permission dialogs have dialog semantics
- [x] Toasts use aria-live
- [x] +/- controls have accessible labels

## Visual / content
- [x] Real device photography replaces CSS laptop drawings
- [x] Accenture homepage cover is contextual imagery
- [x] Most Experience divider rules removed
- [x] Experience logo alignment normalized
- [x] Experience summaries rewritten around progression/problem
- [x] Experience expansions deepened asymmetrically
- [x] Display serif removed in final cascade; system sans used consistently
- [x] Section/project/case-study headings reduced
- [x] Cards/radii/hover lifts reduced
- [x] Commute case-study scaffold made more editorial
- [x] Fun builds no longer artificially enlarges the first item
- [x] Small technical builds flattened
- [x] Ray Tracer uses an output-like scene rather than a box diagram
- [x] Estée Lauder role/challenge context added
- [x] Group Chat narrative explains shared-state challenge
- [x] Scheduler story focuses on three user problems instead of feature accumulation
- [x] Aura opacity reduced and motion paths diversified
- [x] Odd font-weight values normalized
- [x] Dates normalized and retained on mobile
- [x] About copy made less career-coded
- [x] Navigation uses “Fun builds” rather than truncating the full phrase awkwardly

## Interaction / routing / accessibility
- [x] Project cards use a single semantic button target
- [x] Fun-build cards use a single semantic button target
- [x] Case studies are hash-deep-linkable
- [x] Browser back/hash refresh returns the expected case study/home state
- [x] Back control says Projects
- [x] Scheduler prompt removed
- [x] Scheduler share links use the real portfolio hash rather than fake local URLs
- [x] Scheduler emoji action labels removed
- [x] Color freshness cues retain text labels
- [x] Tab/timeline label readability increased
- [x] Duplicate project/device hover lift removed

## Deployment / metadata
- [x] Exact dependency versions pinned
- [x] Build-only tooling moved to devDependencies
- [x] README rewritten for V30
- [x] GitHub Actions uses Node 22
- [x] Vite uses a relative base to work at root or subpath
- [x] External Commute imagery localized
- [x] Key new imagery has dimensions/aspect-ratio controls
- [x] Meta description rewritten
- [x] Raster 1200×630 OG card generated
- [x] Canonical URL added
- [x] Person structured data added
- [x] Unused Google Font requests removed
- [x] Local/source attribution separated from alt text

## Environment-only verification
- [ ] Run `npm install` and `npm run build` in an environment with npm registry access
- [ ] Run `npm run preview` and final Safari/Chrome/device QA

Those last two are execution verification, not unresolved design/code decisions; dependency installation timed out in this container.

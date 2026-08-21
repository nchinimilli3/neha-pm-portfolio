# V29 Comprehensive Portfolio Audit

## Method
I cannot literally spawn autonomous sub-agents in this environment, so I ran four independent review passes over the V29 source: (1) senior PM/recruiter, (2) consumer UI/UX, (3) frontend/accessibility/reliability, and (4) content/brand/anti-vibe-code. Findings were then merged and de-duplicated.

## Executive verdict
**Current state: strong direction, not ready to freeze.** The portfolio has a clear personal visual identity and much better product thinking than earlier versions, but V29 still contains several issues that a careful PM/recruiter or designer will feel even if they cannot name them. The biggest gaps are: Commute demo realism, too much templated visual scaffolding, inconsistent typography choices, project preview mockups that are still CSS constructions rather than real product-in-context photography, and a handful of fake-interactivity / state-consistency problems.

### Overall score
- Senior PM / recruiter: **7.6/10**
- Consumer product UX: **6.9/10**
- Frontend / accessibility / implementation: **6.6/10**
- Writing / brand / anti-vibe-code: **7.3/10**
- Overall: **7.1/10**

A polished V30 could realistically move this into the 8.5–9 range.

---

# P0 — Fix before calling this portfolio final

## 1. Commute demo has time-state contradictions
The iPhone status bar is hard-coded to **9:41**, while the main experience is for a **9:00 AM** destination and displays wake/leave times around 7–8 AM. A user immediately reads the product as fake because the phone says it is already after the meeting.

**Fix:** derive one demo clock and use it everywhere. Default should be around 7:10–7:30 AM. If the user changes arrival time, the status time should remain plausible relative to the scenario.

## 2. Commute station/departure times are partly hard-coded
The wake and leave times recalculate, but the intermediate BART/bus times are hard-coded (`8:19 AM`, `8:17 AM`) and the route detail uses fixed arrival windows (`8:48–8:53`, `8:42–9:04`). Changing arrival time, buffer, delay, or route can therefore create impossible timelines.

**Why this matters:** this is exactly the “fake interactivity” giveaway the site is trying to avoid.

**Fix:** make every visible time derive from one state model: current time → walking leg → vehicle departure → ride leg → final walk → predicted arrival range.

## 3. “Can I sleep longer?” changes the alarm but not the actual morning constraints
`+5/+10/+15` shifts wake time later through `sleepOffset`, but leave time, routine steps, and risk are not recomputed as a coherent constrained plan. A +15 choice can be labeled “Tight” but still simply moves the wake time.

**Fix:** calculate remaining routine minutes and either compress a saved routine, flag skipped steps, or show that the new wake time violates the leave-by constraint. Do not permit an impossible state silently.

## 4. Project “laptop mockups” are still generated CSS laptop shapes
V29 replaced floating screenshots with a CSS-drawn laptop. That is closer, but it still does **not** satisfy the stated direction of real product-in-context photography.

**Fix:** use licensed/real device mockup photography or high-quality device assets, then composite the real UI into the screen. Do not create a fake laptop with gradients and pseudo-elements.

## 5. Accenture preview still uses a generated workflow artifact, not the requested contextual image
The Accenture project cover is still a workflow diagram (`Request → Matching → Review`) with a QA finding. The user explicitly wanted Accenture to use a strong, real Accenture/contextual image as the preview.

**Fix:** homepage preview = real Accenture/context image. The workflow artifact can live inside the case study where it carries evidence.

## 6. Commute data-source case study risks overstating implementation
The case study lists Google Routes, 511, HealthKit, Calendar, Weather, and iOS alarms. The fine print says the browser demo simulates the integrations, which helps, but the visual hierarchy can still make the stack read as already integrated.

**Fix:** distinguish **“Prototype uses”**, **“Native implementation”**, and **“Web demo simulation”** explicitly but briefly. Do not let a recruiter infer that the browser sandbox is actually pulling 511/HealthKit if it is not.

---

# P1 — High-impact product / recruiter issues

## 7. The strongest project story is not instantly obvious on the homepage
Projects are now equal-weight two-column cards, which solves the “giant project” issue, but the card copy still reads similarly across projects. The user’s professional credibility comes from Experience, so Projects should answer “what kind of product thinker is she?” faster.

**Fix:** one-line summaries should express the product decision, not the implementation. Example: FinSimple should communicate ownership in an existing production system; FCVF should communicate user research changing the assessment behavior.

## 8. Experience still contains too many divider lines
Every experience row has a bottom rule. In the screenshot this creates a spreadsheet/list feeling and directly conflicts with the request to reduce horizontal lines.

**Fix:** remove most row borders. Use whitespace and hover/expanded background treatment. Keep perhaps one top/bottom section boundary, not a line between every employer.

## 9. Experience logo/text alignment is improved but still visually awkward
The logos live in white rounded boxes while the text begins at a different optical vertical center. Spectrum and PwC especially feel like pasted assets rather than an integrated experience system.

**Fix:** normalize visible logo bounds, not just image element dimensions. Give logos transparent containers or fixed optical boxes with company-specific scaling. Align company name to logo optical center.

## 10. Experience summaries are still slightly generic
Examples like “Customer products, delivery systems, APIs, and production operations” are factually fine but read like category labels.

**Fix:** collapsed text should reveal the progression or problem. E.g. “Three summers moving from a greenfield feedback product into customer-facing financial features and production delivery.”

## 11. Expanded Experience is not deep enough yet
The current expansion is one paragraph + 2–3 metrics. That is better than a resume dump, but it does not yet deliver the “deeper look” promised.

**Fix:** each experience gets a different expansion structure:
- Accenture: operating model → automation readiness → customer evidence → recommendation
- Ford: three-summer progression timeline
- Spectrum: 3 client engagements
- PwC: scorecard → recommendations
- Career Center: scale + coaching approach

## 12. Typography still conflicts with the stated visual preference
The site’s body uses Inter/system sans, but major headings and project names are still **Georgia**. The user explicitly prefers OpenAI-Sans-like / modern neutral grotesk typography.

**Fix:** remove Georgia as the main display font. Use one modern sans family throughout; create personality through scale, spacing, weight, and color rather than serif/sans switching.

## 13. Headings are still too large / portfolio-template-like
`sectionTitle h2` can reach 64px; hero can reach 128px. This is the exact “huge typography with little information” pattern the user wants to avoid.

**Fix:** reduce section headings significantly. Make Experience / Projects / Fun Things read like editorial document section markers, not campaign headlines.

## 14. The site still uses more cards than the design principles call for
Project cards, fun-build cards, small-build cards, case-study scope cards, deliverable cards, edge-case cards, etc. are still pervasive.

**Fix:** remove at least 25–35% of container surfaces. Let images, text, and whitespace live directly on the page.

## 15. Commute case study still feels slightly “PM portfolio exercise”
Sections such as `Data`, `Decisions`, `Scope`, `What I’d measure` are useful, but when all are presented as equally formal blocks, the page starts resembling a product-school case study.

**Fix:** keep the content but vary the form. For example, put data sources in a compact technical footnote; make decisions editorial pull-outs; show V1/Later/Cut as a single annotated line instead of 3 cards.

## 16. The differentiation from Google Maps is stronger in copy than in the interaction
The key product idea is “work backward from your commitment and morning,” but the current interactive demo still spends substantial surface area on route conditions and BART-vs-NL logic.

**Fix:** make the app’s first 10 seconds unmistakably about wake time / morning planning. Route comparison is secondary.

---

# P1 — Commute app UX details

## 17. Onboarding progress count is wrong
The flow shows “1 of 5” through “5 of 5,” but then has an additional `Commute setup` stage. That makes the setup feel longer than promised.

**Fix:** either make it 1 of 6, or treat Commute setup as the final “Done” screen outside the progress count.

## 18. Health has a permission sheet; Calendar, Location, and Alerts do not
This creates inconsistent iOS behavior. One permission feels system-like; the others are ordinary app buttons that instantly flip state.

**Fix:** every permission should use a consistent simulated native prompt/sheet pattern with allow/decline options.

## 19. Location permission wording is not sufficiently realistic
“Allow location” instantly becomes “While Using the App.” Real iOS permission language would distinguish approximate/precise and usage scope.

**Fix:** simulate `Allow While Using App`, `Allow Once`, `Don’t Allow` in a lightweight system prompt. If continuous commute detection is part of the concept, explain later why Always access might be requested, not during first-run onboarding.

## 20. Calendar permission needs scope
If the app is reading event location/time, it should make clear what it reads. The current screen says “Connect Calendar” without any indication of which calendars or data.

**Fix:** show a system-like access prompt and an app-level explanation: event title, time, and location only for commute planning.

## 21. Alerts + alarms are conflated
Notifications and alarm creation are different capabilities and trust decisions. Combining them in one permission row is conceptually muddy.

**Fix:** alerts permission first; alarm behavior preference separately: `Suggest alarm changes` / `Auto-adjust up to X min` / `Never change automatically`.

## 22. Apple Health personalization is arbitrary in the demo
Connecting Health changes walking time from 8 min to 10 min. There is no visible evidence for why 10 is the personalized number.

**Fix:** show one compact result: “Maps estimate 8 min · your typical morning pace 10 min.” That makes the feature feel grounded.

## 23. No onboarding name field despite personalized greeting
`name` is state, defaulted to Neha, but the flow never lets the demo user change it.

**Fix:** either remove the name personalization from the recruiter demo or ask name once on the first screen.

## 24. Origin starts with a precise personal street address
For a public portfolio demo, this is unnecessarily precise.

**Fix:** use `Whole Foods Oakland / Lake Merritt` or a neighborhood-level demo origin by default, and let the user enter their own origin in the sandbox.

## 25. The product has no clear “current time” model
The app computes wake/leave times but does not distinguish future plan vs current state. That makes “Wake up” ambiguous if current time is already after wake time.

**Fix:** one scenario clock drives all state. If current time < wake time: tomorrow/tonight plan. If current time is between wake and leave: countdown. If current time > leave: late/replan state.

## 26. Freshness is global rather than source-specific
The single `stale` boolean makes all three sources stale at once, even though real feeds age independently.

**Fix:** separate freshness for BART, NL, and traffic. This is also a better sandbox interaction.

## 27. Freshness labels are plausible but not behaviorally deep enough
`updated 6m ago` is displayed, but the weighting is only a fixed extra risk number.

**Fix:** show the user-visible consequence only when it changes the recommendation: “NL location is old, so the recommendation is leaning on schedule + historical behavior.”

## 28. “Why BART?” headline logic contains a wording bug
When `takeBart` is false, the detail sheet heading currently says: **“BART is steadier. The bus saves enough time today.”** The sheet title is `Why NL bus?`, so leading with BART is confusing.

**Fix:** use route-specific copy generated from the recommended route.

## 29. Route risk formulas are hidden and arbitrary
`busDelay*4`, `bartDelay*3`, bridge weights, etc. are fine for a toy state machine but not credible as a “confidence” model.

**Fix:** either expose this as simple rule-based demo logic or switch to interpretable factors without implying statistical confidence.

## 30. “Observed patterns” language is unsupported in the actual demo
The stale-state sentence says schedules and observed patterns are carrying more weight, but the demo has no real historical model.

**Fix:** say `scheduled service + demo historical assumptions` or remove historical implication from the sandbox.

---

# P1 — Frontend / deployment / reliability

## 31. Dependencies use `latest`
All dependencies are pinned to `latest`, making builds non-reproducible and potentially breaking unexpectedly.

**Fix:** pin exact versions and commit `package-lock.json`.

## 32. Build tooling is in `dependencies`
Vite, TypeScript, React types, and the React Vite plugin are production dependencies.

**Fix:** move build-only packages to `devDependencies`.

## 33. README is stale
README says V15 / V18 are current even though package version is 29.

**Fix:** rewrite README for V29/V30 and remove old version references.

## 34. GitHub Actions uses Node 24
This is future-facing and may be less stable with ecosystem tooling than an LTS release.

**Fix:** use the current LTS Node line supported by the project, and pin it intentionally.

## 35. `npm install` instead of `npm ci`
For production deployment, `npm ci` with a lockfile is more deterministic.

## 36. Vite base path must match the actual GitHub Pages repo path
`base: '/neha-pm-portfolio/'` is correct only if the live site is served under that repository path. If this is a user site or differently named repo, asset URLs will be wrong.

**Fix:** verify against the actual repo and GitHub Pages URL before final push.

## 37. External Unsplash hotlinks create fragility
Commute preview/in-use imagery loads directly from Unsplash URLs. This can introduce performance, privacy, referrer, or availability issues.

**Fix:** download permitted images, optimize to WebP/AVIF, store locally, and keep subtle attribution.

## 38. No image dimensions specified
Images can contribute to layout shift because width/height metadata is generally not specified in markup.

**Fix:** include intrinsic dimensions or use CSS aspect ratios consistently.

## 39. No production build was verified
The environment could not complete `npm install`, so V29 has not actually passed a full Vite build.

**Fix before publish:** clean install, `npm run build`, then local `npm run preview` and test in Safari + Chrome + mobile.

---

# P1 — Accessibility / interaction

## 40. Clickable `<article role="link">` contains a nested `<button>`
Both ProjectCard and MoreProjectCard use the whole article as a link while also placing a button inside. This creates duplicated interactive targets and can be awkward for keyboard/screen-reader users.

**Fix:** use a single semantic link/button target or make only the title/CTA interactive.

## 41. `LaptopMockup` puts `aria-label` on a non-interactive div while the image already has alt text
The div label is redundant and may create noisy semantics.

## 42. Icon-only controls lack accessible names
Routine `+ / −`, buffer `+ / −`, avatar button, and several nav controls rely on visible symbols without explicit `aria-label`s.

**Fix:** `aria-label="Increase shower duration"`, etc.

## 43. Simulated permission sheets are not dialogs semantically
No `role="dialog"`, `aria-modal`, labelled-by relationship, or focus management.

**Fix:** add dialog semantics and focus return.

## 44. Full sheets do not trap/focus correctly
When `detail` opens, background tabs remain in the DOM and may remain reachable by keyboard.

**Fix:** modalize the sheet semantically or use an in-app navigation pattern instead of overlaying it.

## 45. Toast is not announced
The toast has no `aria-live`, so screen-reader users will not hear “Calendar connected” / “Walking personalization on.”

## 46. Color-only freshness cue risk
Green/yellow dots are accompanied by text labels, which is good, but ensure contrast and do not rely on dot color in other views.

## 47. Some small text is below ideal mobile readability
10px tab labels and 10px timeline labels are visually plausible but small for an interactive demo embedded inside a web page.

**Fix:** slightly increase or scale the phone demo larger on desktop.

## 48. Hover animation is applied to project cards even though user asked to minimize decorative motion
The project card moves upward on hover, and the laptop itself also moves. Two layers of lift is unnecessary.

**Fix:** one subtle state change only.

---

# P2 — Writing / anti-vibe-code details

## 49. “Your morning, timed backwards.” is clean but still feels tagline-like
It is better than generic AI copy, but if the product UI is meant to be minimal, `Commute` + one sentence may feel more native.

## 50. “Make walking estimates yours.” is marketing-ish onboarding copy
More natural: `Use your walking pace` or `Personalize walking time`.

## 51. “Let your calendar do the setup.” sounds promotional
More native: `Connect your calendar` with one sentence underneath.

## 52. “Only interrupt me when it matters.” sounds like a product principle being spoken to the user
Better: `Commute notifications` / `Choose what can notify you`.

## 53. “Commute learns carefully.” is meta/product-marketing copy
Settings should simply say `Personalization` or `Your data`.

## 54. “The bus is less forgiving this morning.” is charming but slightly authored
Keep only if this tone is intentional throughout the product; otherwise use `Missing the NL adds more wait time today.`

## 55. “One recurring question” card on the homepage is unnecessary explanation
The image + title + project summary already establish the product. This extra label is exactly the kind of tiny explanatory subheading the user asked to remove.

## 56. Many case study headings still narrate structure instead of telling the story
`Context`, `Data`, `Decisions`, `Scope`, `What I’d measure`, `Original assessment`, `Iteration`, `What shipped` are all reasonable individually, but repeated across multiple pages makes the portfolio feel templated.

**Fix:** vary headings around the actual project story.

## 57. Some metrics are presented as visually decorative evidence
MetricStrip uses Georgia display numbers and top/bottom rules. This can make metrics feel like portfolio ornament.

**Fix:** integrate metrics into sentences or small metadata rows unless the number itself is the story.

---

# P2 — Visual system details

## 58. Background aurora is still very prominent behind Experience
The colored blooms make rows harder to visually align and compete with company logos.

**Fix:** reduce aura opacity specifically under dense information sections. Let blooms be more visible in hero / transitions and quieter behind Experience.

## 59. Aura animation moves all blooms using the same keyframe path
Different durations help, but every bloom follows the same underlying translation path, so motion can still feel synchronized.

**Fix:** 3–4 different motion paths or CSS custom-property start/end vectors.

## 60. Aura opacity breathing can compete with text
`opacity .55 → .78` is fairly visible. Reduce the amplitude.

## 61. Cards still use many rounded corners
Project cards, editorial covers, laptop labels, fun cards, small builds, about photo, scope cards, etc. still reinforce one rounded-rectangle language.

**Fix:** flatten more surfaces and use squared/soft 8–12px radii where appropriate.

## 62. Laptop label is another unnecessary floating chip
`Customer Value Framework` / `FinSimple` is already written directly beside the visual.

**Fix:** remove `laptopLabel`.

## 63. Device mockup hover movement is decorative
The laptop lifts 3px inside a card that already lifts.

## 64. Project card title size is still very large in a two-column grid
31–39px may be fine, but together with large serif type it makes the cards feel campaign-like.

## 65. Fun Things grid gives Commute extra visual dominance again
`funLeadGrid .moreBuildCard:first-child{grid-row:span 2}` means Commute is visually emphasized even though the user said there does not need to be artificial emphasis.

**Fix:** make Fun Things more even, or let size depend on content rather than first-child rule.

## 66. Small-build cards are still cards
Ray Tracer / Stable Fluids / Spartan Touchdown could be a more editorial thumbnail grid with no container backgrounds.

---

# P2 — Content / portfolio strategy

## 67. Serious Projects ordering is correct for Ford pairing but Accenture + Scheduler need deliberate second-row pairing
The current array is FCVF, FinSimple, Accenture, Scheduler, which naturally makes the requested Ford row first. Good. Make sure image heights and copy lengths are balanced so row 2 does not look accidental.

## 68. Commute belongs in Fun Things, but its deep case study needs an intentional rationale
Do not let the depth of the Commute case study make Fun Things look like “projects I care about more.” Keep homepage treatment comparable while allowing depth after click.

## 69. Ray Tracer was previously considered for removal
If it remains, it should earn space with a strong visual output. A schematic “camera ray → surface → reflection” is weaker than an actual rendered scene.

## 70. Estée Lauder needs the exact role/context to avoid looking like a random brand redesign
The case study currently says brief + final screens. Add one compact line about the challenge/hack context and your role.

## 71. Synchronized Group Chat has a stronger demo than its case study narrative
The case study only lists real-time behaviors. Add one short paragraph on what made synchronization hard / what you learned about shared state.

## 72. Scheduler still has some feature-list language
`venues, notes, chat, sharing + calendar handoff` reads like accumulation. The stronger story is the three user problems: uncertainty, repetitive entry, post-time coordination.

---

# P2 — SEO / metadata / polish

## 73. Meta description is generic
“product, enterprise software, and technical projects” does not reflect the sharper site story.

## 74. OG image is SVG
Some social platforms handle SVG poorly for Open Graph previews.

**Fix:** generate a 1200×630 PNG/JPEG social card.

## 75. No canonical URL
Add once final domain/repo path is fixed.

## 76. No structured data
Optional, but Person schema can help basic metadata consistency.

## 77. Google Fonts are loaded but CSS defaults to Inter/system
The HTML loads DM Sans and Manrope, but CSS uses Inter/system and Georgia. This is wasted network cost and evidence of design drift.

**Fix:** choose one typography system and remove unused font requests.

## 78. `<script src="/src/main.tsx">` is fine in Vite dev/build, but base-path behavior should be verified
Vite rewrites it during build, but this reinforces the need to run a real production build before publishing.

---

# P3 — Tiny details worth fixing

## 79. `font-weight:590`, `560`, `540` are unusual values
Variable fonts can support them, but Georgia/system font combinations may not. They can render inconsistently.

## 80. “2023–25” and “2022–26” vs “2025–present” date formats are inconsistent
Choose `2023–2025`, `2022–2026`, `2025–present` or a shorter consistent convention.

## 81. “Technology Summer Analyst” may be less familiar than the official internship label elsewhere
Use the exact title consistently across resume and portfolio.

## 82. Experience `time` disappears entirely on mobile
Dates are useful context. Consider moving date underneath role rather than hiding it.

## 83. Back button does not expose current project title
`← Back` is okay, but `← Projects` can be clearer.

## 84. Case study transition restores home scroll, which is good, but browser Back does not appear to be integrated
Opening a case study changes React state only. Browser history/back button will not necessarily behave like page navigation.

**Fix:** use History API or hash/query routes.

## 85. Deep links to case studies are impossible
A recruiter cannot copy a direct URL to Commute / Ford case study.

**Fix:** route case studies (`/projects/commute` or hash routes compatible with GitHub Pages).

## 86. Refresh inside a case study returns to homepage
Same root cause as above.

## 87. `window.prompt` is used in Scheduler for notes
This breaks visual continuity and feels prototype-y.

**Fix:** inline note field or native-feeling popover.

## 88. Scheduler copy/share uses fake `portfolio-demo.local` URLs
This is transparent as a sandbox but still feels fake if a recruiter clicks Copy.

**Fix:** copy the actual portfolio demo URL/hash.

## 89. Emoji are used in Scheduler action buttons
The anti-vibe-code principles specifically called out emoji-as-product-design. Replace with simple text or SF-symbol-like icons.

## 90. “Live” appears frequently across the codebase
Not every appearance is bad, but audit every `Live` label and retain it only where it communicates real freshness/status.

## 91. A single stale toggle is labelled “Stale live feed” rather than source-specific
Also covered functionally above; wording should name the source.

## 92. `Weather` is listed as a data source but has no actual demo state
Either add a meaningful weather edge case or remove it from V1/data display.

## 93. Driving is mentioned in the origin story but not represented in the demo
If “Michigan driving” is an important origin story, show it under Later or a tiny alternate saved commute. Do not imply V1 handles driving if it does not.

## 94. There is no actual History tab in Commute despite “learn over time” being part of the product story
The app has Today, Plan, More. If learning is central, a subtle `History`/`Accuracy` surface may be worth one screen—or explicitly defer it.

## 95. Settings uses “More” tab with ellipsis symbol
This feels generic. If there are only three destinations, `Settings` is clearer than `More`.

## 96. Status bar symbols are fake text (`●●● 5G ▰`)
This is visually brittle and will never look exactly like iOS.

**Fix:** use a real device frame/status-bar asset or simplified neutral status bar.

## 97. Dynamic Island size/position is custom CSS
Even though proportions improved, it still reads as an imitation. This supports using a real iPhone frame asset.

## 98. Photo credits are in alt text as well as figcaption
Alt text should describe the image, not include attribution. Keep attribution in figcaption only.

## 99. About copy is good but still slightly career-coded
“I studied computer science and supply chain because…” is reasonable, but if About is meant to be personal, one sentence could be more human and less explanatory.

## 100. “Fun things I’ve built” nav shortens to “Fun things”
Not a major problem, but full wording is more distinctive. Consider `Fun builds` if space is tight.

---

# What is already working well

1. **Homepage order** (Experience before Projects) is strong for recruiter scanning.
2. **Ford FCVF + FinSimple in one row** is the right information-density choice.
3. **Experience accordion** is the correct interaction pattern; inline expansion is much better than modals.
4. **Commute origin story** is authentic and materially better than a generic PM exercise.
5. **Freshness dots** are the right subtle trust cue.
6. **No fake measured PM metrics** in the Commute validation section.
7. **V1 / Later / Cut** shows scope judgment.
8. **Reduced-motion support** exists.
9. **Focus-visible styling** exists.
10. **Headshot + About** gives the site a real-person layer without turning the hero into a personal brand poster.
11. **Separate Projects vs Fun Things** is a strong content architecture.
12. **Frontier AI lab** wording is much safer and more precise than naming the client directly.

---

# Recommended V30 order of operations

### Phase 1 — correctness
1. Make Commute’s entire timeline derive from one state model.
2. Fix scenario clock / status bar.
3. Fix sleep-later constraint logic.
4. Make source freshness independent.
5. Fix onboarding step count and permission consistency.
6. Add proper routing/history for case studies.
7. Pin dependencies + lockfile + successful production build.

### Phase 2 — visual cleanup
8. Replace CSS laptops with real device mockup photography/assets.
9. Replace Accenture cover with real contextual image.
10. Remove most Experience row dividers.
11. Normalize logo optical sizing/alignment.
12. Replace Georgia with chosen modern sans; reduce heading sizes.
13. Remove 25–35% of card containers and tiny labels.
14. Remove duplicate hover/lift animation.

### Phase 3 — narrative
15. Deepen Experience expansions asymmetrically.
16. Tighten project-card summaries around product decisions.
17. Remove remaining “product school” case-study scaffolding.
18. Strengthen Estée / Chat / Scheduler stories without adding length.
19. Decide whether Ray Tracer earns its place visually.

### Phase 4 — accessibility / polish
20. Fix nested interactive targets.
21. Add labels for icon-only buttons.
22. Add proper dialog semantics/focus for permission/full sheets.
23. Add aria-live to toasts.
24. Preserve dates on mobile.
25. Localize/optimize external photography.
26. Generate raster OG card and update metadata.
27. Test Safari, Chrome, iPhone-size viewport, keyboard-only, reduced motion, high contrast.

---

# Final recruiter test
Before freezing V30, a recruiter should be able to answer these in under 30 seconds:

- Who is Neha? **CS + Supply Chain student with real product/engineering/consulting experience.**
- Where has she worked? **Accenture, Ford/Ford Credit, Spectrum, PwC, MSU Career Center.**
- Does she have product judgment? **Yes; the case studies show user research, prioritization, tradeoffs, technical constraints, and measurement.**
- Can she build? **Yes; interactive scheduler/chat/Commute demos and technical projects prove it.**
- Does the site feel generated? **It should not once the remaining template/card/device-mockup artifacts are removed.**
- What is memorable? **The combination of serious enterprise work + weirdly useful personal builds, especially Commute.**


# V41 — consolidated feedback build

This version starts from the uploaded V39 source and replays the complete feedback sequence from the Aug. 22 review before packaging.

## Accenture case study
- Reworked tech-logo hover states so the highlight hugs the mark instead of appearing as a misaligned rectangle.
- Expanded the five-metric strip across the full case-study width.
- Renamed the learner user to “Learner / Enterprise Customer.”
- Replaced the boxed Request / Matching / Review visualization with an editorial three-step sequence.
- Changed the QA label to “QA finding example:” and clarified the 10:30 PM failure as incorrect time-zone matching.
- Added Salesforce, Gmail, and calendar integration context; Gmail and Google Calendar are also represented in the Accenture tech stack.

## Homepage and experience
- Hero philosophy now reads: “My philosophy in life is work smarter, not harder, and I apply that to everything I do.”
- Added “Learn more about me ↓” to the hero.
- Increased hero color/vibrancy with restrained pastel blooms.
- Removed the 10:30 PM QA anecdote from the homepage Accenture experience expansion.
- Rewrote Palmer Peer Coach copy around concrete one-on-one responsibilities.
- Expanded PwC × Arc of Indiana context, independent research scope, client description, benchmarking method, and strategy work.
- Commute card now says “Independent app · iOS.”
- Group chat is now “iMessage Recreation on Web” with an MSU CSE 477 web-architecture label.
- Estée Lauder project is now “Double Wear Foundation.”
- Added fuller descriptions to Spartan Touchdown and Stable Fluids.
- About copy now uses the high-school commute-script → iOS-app story instead of repeating “work smarter, not harder.”
- Increased spacing between the photography CTA and book recommendation form; Submit becomes colorful on hover/press.
- Project “View case study” links now inherit each project’s eyebrow accent color.

## FinSimple
- Base-path-aware image handling plus eager loading for the Dummy Data screenshot fixes the blank render on GitHub Pages/Safari.
- Removed the redundant ownership line from the case header and consolidated ownership into the main summary.
- Preserved the full wide Dummy Data capture rather than treating the issue as a crop problem.

## Commute
- Expanded routine setup to separate Shower, Hair, Makeup, Coffee, Breakfast, Morning phone scroll, Buffer, Commute to gym, Gym, and Commute from gym. Gym-related steps default to 0 minutes and can be enabled by the user.
- Health setup now names Apple Health “Walking Speed” data and explains how HealthKit improves walking-time estimates.
- Conditions explicitly says it is a portfolio-demo-only simulator; the real app receives BART/AC Transit GTFS-Realtime/511, traffic, and weather inputs automatically.
- Removed the white rounded-box treatment around Settings rows.
- Renamed the NL source to “NL · AC Transit bus.”
- Removed the visible container box around the technical section.
- Reworked the technical section as “Native iOS architecture + APIs” with SwiftUI, Google Routes API, 511/GTFS-Realtime, 511 traffic, HealthKit, EventKit, Core Location, WeatherKit, AlarmKit/UserNotifications, and observed commute history.
- Removed the North Star sentence and kept the evaluation metrics on one desktop line.
- Expanded later scope to broader recurring commute use, Michigan driving, and transit systems such as New York and Chicago.
- Case-study company label is now “Personal iOS app.”
- “Why I built it” now explains why iOS is the right morning surface and how the recommendation turns into an alarm.
- Broader-user copy now describes the multi-step-routine + repeated Maps/transit mental-math problem.
- Replaced the homepage’s reconstructed CSS phone preview with a static capture of the actual demo UI.

## Photography
- Page title changed to “Portfolio.”
- Removed the location rollup, rotating-set sentence, and browse/swipe instruction.
- Film stocks: UMich ColorPlus 200; MSU ColorPlus 200 & Portra 400; San Francisco Ultramax 400 and Portra 400; Lake Tahoe Portra 400; Yosemite Portra 800; Hawaii Portra 400; Chicago Ultramax 400.
- Gallery and thumbnail URLs resolve through the Vite base path, and filmstrip thumbnails no longer rely on lazy loading.
- Desktop photo stages are approximately 60% of viewport width.
- Hawaii thumbnails preserve the full image with `object-fit: contain`; the source files contain no Instagram UI.
- Verified all 41 gallery JPEGs are present and readable.

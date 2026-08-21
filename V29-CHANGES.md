# V29 changes

- Ford Customer Value Framework and FinSimple now render as laptop product mockups rather than floating screenshots.
- Serious Projects are a two-column desktop grid; Ford projects sit side-by-side instead of taking full-width rows.
- Experience rows are realigned with consistent logo, text, date, and disclosure columns.
- Experience logos no longer overlap headings; disclosure controls are centered.
- Commute App onboarding now includes Morning Routine, Apple Health, Calendar, Location, and Alerts/Alarms setup before commute confirmation.
- Apple Health Allow now advances correctly instead of leaving the demo stuck.
- Location permission affects the product setup story and is visible in Settings.
- Alerts/alarms permission is included and visible in Settings.
- Routine and arrival-buffer plus/minus controls are optically centered.
- Restart Demo clears connected permissions and returns to first launch.
- Mobile falls back to one-column Projects and compact Experience alignment.

## Verification

`tsc --noEmit` completed through parsing with no JSX/syntax errors. Dependency-resolution errors remain because the uploaded project does not contain installed React packages/node_modules. `npm install` was attempted but timed out in this environment.

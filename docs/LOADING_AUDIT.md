# Loading audit — October 9, 2026

The source audit found avoidable startup competition and delayed scene reveals. These are fixed locally. Desktop/phone loading times and frame smoothness remain unmeasured because the browser-control tool cannot access the in-app browser in this session.

## Changes

- All local fonts use `font-display: swap`, so text can render before the font downloads finish. The two primary fonts remain preloaded; secondary handwriting/italic fonts load when needed. Font swaps still require visual layout-shift testing.
- The opening desk waits only for its eager images, with an 800 ms fallback scheduled after mounting. Unrelated fonts and lazy images no longer gate it. Main-thread blocking can delay a timer, so this is not an end-to-end loading-time guarantee.
- Image failures, stalled decoding, and cancellation during view changes cannot leave the scene permanently covered or trigger a late reveal. Four regression tests cover these behaviors.
- The portrait has a high-quality 600 × 900 candidate (138,864 bytes), alongside the unchanged 1200 × 1800 original (417,835 bytes). Browser selection depends on viewport size and pixel density. The 20% crop is unchanged.
- Fun Builds warms its four screen/sprite images within 1200 px of the section, instead of preloading them at mount. Those files total 354,615 bytes. Actual screen images use native lazy loading. An unused 109,707-byte Bookclub screenshot no longer gets preloaded.
- Resume prefetching is removed. Case code warms on project hover/focus or after scrolling half a viewport; direct case URLs still load on demand.
- The desk notification and menu use the small PNG favicon directly.
- The fluid demo resumes when the browser tab becomes visible again, if its canvas remains in view.

## Verified

- `npm run test:loading`: four tests passed with Node 22.
- Production build passed. Vite still warns about large chunks.
- The built homepage, its linked CSS/JS, primary fonts, both portrait candidates, and notification icon returned HTTP 200 from a temporary loopback server. The server was stopped afterward.
- The external `fonts.css` file exists in the production output despite Vite's build-time resolution warning.
- Initial CSS: 1,004,141 bytes uncompressed; Vite reports 202.31 KB gzip.
- Initial JavaScript: 602,639 bytes uncompressed; Vite reports 192.56 KB gzip.

## Remaining acceptance checks

The initial CSS/JS budget remains substantial, especially the 1 MB stylesheet. Further splitting needs rendered regression checks because existing case CSS deliberately preserves cascade order.

Browser verification must cover cold and warm loads at 1440 × 900 and 390 × 844, slow-network/CPU throttling, reduced motion, scene arrival, first project tap, opening/closing cases, font swaps, image failure, and returning from a background tab. Record LCP, CLS, INP, and scrolling frame times. No browser score or real-device acceptance is claimed here.

Guidance: https://web.dev/articles/optimize-lcp and https://web.dev/learn/performance/optimize-web-fonts

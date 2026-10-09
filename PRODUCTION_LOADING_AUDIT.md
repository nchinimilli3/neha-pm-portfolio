# Production loading audit — October 9, 2026

Target: https://nehachinimilli.com/

This is a read-only audit of deployed HTML, asset responses, compiled JavaScript, CSS, and caching. It is not a rendered desktop/phone test or a Lighthouse run.

## Confirmed live findings

| Check | Production evidence | Implication |
|---|---|---|
| Homepage | HTTP 200; one request had 0.265 s to first byte | HTML delivery responded promptly from this machine; this is not page paint time |
| Entry JavaScript | 602,173 decoded bytes; 193,261 transferred bytes with gzip | Substantial code to parse and execute before React renders the portfolio |
| Entry CSS | 1,004,141 decoded bytes; 208,469 transferred bytes with gzip | A large render-blocking stylesheet shared by desktop and phone |
| Fonts | Four font preloads total 153,728 bytes; eight font faces use `font-display:block` | Text may remain invisible while fonts download |
| Opening portrait | Full-resolution JPEG is 417,835 bytes | Production has no smaller responsive candidate yet |
| Desk reveal | Deployed JS awaits `document.fonts.ready` plus stage-image decoding; 1500 ms fallback | Unrelated fonts can delay the room reveal |
| Fun Builds | Deployed JS preloads five image files on mount; includes unused Bookclub screenshot | Lower-page resources compete for early bandwidth |
| Case code | Idle prewarming remains in deployed JS | Case code is fetched without project intent |
| Caching | Sampled resources use `Cache-Control: max-age=600`; JS/CSS are gzip encoded | Compression works; repeat visits after ten minutes may revalidate resources |
| Desk icons | Two deployed `img` elements use `favicon.svg`; that file links to external `favicon-master.png` | SVG image restrictions prevent the linked PNG from rendering; direct PNG replacements are prepared locally |
| Experience layout | Live CSS contains explicit text-column placement and the 900 px compact breakpoint | Previous layout fix is deployed; rendered acceptance is still pending |

All eleven sampled asset responses returned HTTP 200. The coffee favicon links are deployed. The latest loading changes are present only in the working tree; the current committed revision is `cff4fa4`.

## Verification limits

The browser tool returned `Browser is not available: iab`. Google's mobile and desktop PageSpeed API requests both returned HTTP 429. No LCP, CLS, INP, Lighthouse score, animation frame profile, cold/warm browser waterfall, or phone/desktop interaction acceptance was obtained. Curl timings are network checks from this machine, not simulated mobile measurements.

## Recommended next steps

1. Publish the prepared loading fixes and verify the deployed files changed.
2. Run cold/warm desktop and phone browser audits, including constrained CPU/network, desk arrival, scrolling, first project tap, and case close/return.
3. Split case-only styles from the 1 MB entry stylesheet while testing cascade order and rendered layouts. This is the clearest remaining structural loading issue.

SVG image restriction reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image

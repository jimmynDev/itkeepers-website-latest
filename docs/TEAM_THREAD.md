# Home: The context travels

`src/components/TeamThread.astro` follows the hero, before Services. It adds one
editorial composition around the existing positioning, using an illustrative
four-part narrative: familiar engineer, shared context, wider expertise, follow-up.
A cyan schematic trace connects abstract role labels and a layered context packet. No people,
client information, operational timing or telemetry are represented.

## States and responsive behavior

- Initial HTML / JavaScript unavailable: complete board, four readable chapters,
  no inactive control. The board is decorative (`aria-hidden`); equivalent meaning
  is provided by the ordered narrative and its adjacent HTML summary.
- Enhanced desktop: at least 901px wide and 700px high, with a measured board that
  fits the viewport. The board stays beside the chapters. Scrolling draws the
  connecting thread and moves notes/role labels by at most 32px. Packet alignment uses a bounded 4-degree rotation; smoothstep easing keeps reversible scroll scrubbing precise. No text fades or
  becomes inaccessible. Reverse scrolling reverses the same relationship.
- Pause: native button toggles `aria-pressed`. Full diagram becomes stable while
  existing sticky/chapter geometry remains. Resume uses current scroll position.
- Reduced motion: ordinary complete static composition, no sticky extended scroll
  or transforms; responds to preference changes. Mobile/short viewport/oversized
  text uses the same complete ordinary-flow fallback. ResizeObserver rechecks fit.
- Scrolling is passive, never captured. At most one requested animation frame is
  pending; offscreen composition does not schedule frames. No timer/autoplay,
  live announcement, programmatic focus or persistent storage is used.
- Keyboard: standard Tab and Enter/Space for the native pause/resume control.
  Existing contextual focus styling applies. No other custom keyboard behavior.

## Validation

Pass: Astro production build with the component integrated; 10 static routes.
Pass: integration configured Vite `assetsInlineLimit: 0` and verified an external
same-origin animation module, preserving the existing `script-src 'self'` CSP.
Pass: compiled module logic tested in Node VM with simulated DOM/observer/media
state: scroll bounds/reversal, one pending frame, pause preserving geometry,
resume, reduced-motion, viewport overflow and missing observer fallback. These
checks do not verify browser layout or accessibility rendering.
Pass: source review confirms initial semantic narrative, local styles, existing
contrast tokens, bounded transforms, passive scrolling and complete fallback.
Board text uses white/dark or navy/light existing combinations; cyan meaningful
thread against #071f44 exceeds 7:1. No text/control opacity is used.

Blocked: browser preview automation was rejected by the browser URL security
policy in integration review. Screenshots, actual computed styles, zoom/reflow,
keyboard, reduced-motion rendering, forced-colors, screen-reader and device tests
are unverified. QA owner should inspect 320/375/768/1024/1440px, 200%/400% zoom,
scroll in both directions, pause/resume mid-chapter and change motion preferences.

Implementation follows native IntersectionObserver, requestAnimationFrame and
prefers-reduced-motion behavior documented by MDN:
https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion

## 30 September refinement

The approved local composition now uses oversized system-font editorial typography,
generous spacing, monospace schematic annotations, a layered ENV/ASK/NEXT context
packet, and a rectilinear SVG returning trace. The trace draws along its actual
path using normalized dash offset, while the dotted full path remains visible.
No text fades, counts, telemetry, new factual copy or Apple assets are introduced.
The SVG is decorative and unfocusable; the semantic narrative is unchanged.

Pass: refined production build, 10 routes; external animation module remains
same-origin (approximately 1.44kB before gzip), compatible with existing CSP.
Integration reran the compiled module in Node VM: eased intermediate progress,
endpoints, reverse scrolling, one pending frame, pause/resume, reduced-motion
changes, overflow and missing-observer fallback pass. These simulate geometry
and state, not browser rendering. Browser/manual checks remain blocked.

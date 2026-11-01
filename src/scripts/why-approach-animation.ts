/** Continuous SVG/CSS ambience; card selection is independent of motion. */
const mounted = new WeakSet<HTMLElement>();
export function mountWhyApproach(root: HTMLElement) {
  if (mounted.has(root)) return;
  mounted.add(root);
  const svg = root.querySelector<SVGSVGElement>('.paths');
  const branches = [...root.querySelectorAll<SVGGElement>('[data-branch]')];
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-capability]')];
  if (!svg || buttons.length !== 3 || branches.length !== 3) return;
  const media = window.matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  let selected = 0, visible = false, userPaused = false;
  const pauseControl = root.querySelector<HTMLButtonElement>('[data-approach-pause]');
  const contextTitle = root.querySelector<HTMLElement>('[data-context-title]');
  const contextCopy = root.querySelector<HTMLElement>('[data-context-copy]');
  let disposed = false;
  const events = new AbortController();
  svg.pauseAnimations();
  svg.setCurrentTime(0);
  root.dataset.enhanced = 'true';
  buttons.forEach(button => { button.disabled = false; });
  if (pauseControl) pauseControl.hidden = false;
  const paint = () => {
    const index = selected;
    branches.forEach((branch, i) => {
      branch.classList.toggle('is-active', i === index);
      branch.classList.toggle('is-selected', i === selected);
    });
    buttons.forEach((button, i) => {
      button.classList.toggle('is-active', i === index);
      button.classList.toggle('is-selected', i === selected);
      button.setAttribute('aria-pressed', String(i === selected));
    });
    const title = buttons[selected].querySelector('strong')?.textContent ?? '';
    const copy = buttons[selected].dataset.explanation ?? '';
    if (contextTitle && contextTitle.textContent !== title) contextTitle.textContent = title;
    if (contextCopy && contextCopy.textContent !== copy) contextCopy.textContent = copy;
  };
  const reconcile = () => {
    const animate = !disposed && visible && !document.hidden && !media.matches && !userPaused;
    root.dataset.motion = animate ? 'running' : 'paused';
    if (animate) svg.unpauseAnimations(); else svg.pauseAnimations();
    if (pauseControl) {
      pauseControl.textContent = userPaused ? 'Resume' : 'Pause';
      pauseControl.setAttribute('aria-label', `${userPaused ? 'Resume' : 'Pause'} Connected Engineering animation`);
      pauseControl.disabled = media.matches;
    }
    paint();
  };
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => { selected = i; paint(); }, { signal: events.signal });
  });
  media.addEventListener('change', reconcile, { signal: events.signal });
  pauseControl?.addEventListener('click', () => { userPaused = !userPaused; reconcile(); }, { signal: events.signal });
  document.addEventListener('visibilitychange', reconcile, { signal: events.signal });
  const observer = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); reconcile(); });
  observer.observe(root);
  window.addEventListener('pagehide', () => { visible = false; reconcile(); }, { signal: events.signal });
  window.addEventListener('pageshow', () => { const r = root.getBoundingClientRect(); visible = r.bottom > 0 && r.top < innerHeight; reconcile(); }, { signal: events.signal });
  document.addEventListener('astro:before-swap', () => {
    disposed = true; reconcile(); observer.disconnect(); events.abort();
  }, { once: true, signal: events.signal });
  reconcile();
}

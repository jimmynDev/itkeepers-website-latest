/** Continuous logo motion: preserve CSS clocks when paused or outside the viewport. */
const mounted = new WeakMap<HTMLElement, () => void>();

export function mountTechnologyMarquee(root: HTMLElement): () => void {
  const existing = mounted.get(root);
  if (existing) return existing;
  const media = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  let visible = !('IntersectionObserver' in window);
  let parked = false, ready = false, requested = false, disposed = false;
  let observer: IntersectionObserver | undefined;

  const reconcile = () => {
    if (disposed) return;
    root.toggleAttribute('data-marquee-static', media.matches);
    root.toggleAttribute('data-marquee-running', ready && visible && !document.hidden && !parked && !media.matches);
  };
  const loadLogos = () => {
    if (requested) return;
    requested = true;
    // Horizontally clipped lazy images may otherwise remain unloaded until they
    // enter the marquee. Decode both identical groups before the first movement.
    const images = [...root.querySelectorAll<HTMLImageElement>('.logo-track img')];
    images.forEach(image => { image.loading = 'eager'; });
    void Promise.allSettled(images.map(image => image.decode())).then(() => {
      if (disposed) return;
      ready = true;
      root.setAttribute('data-marquee-ready', '');
      reconcile();
    });
  };
  const onHide = (event: PageTransitionEvent) => {
    if (!event.persisted) dispose();
    else { parked = true; reconcile(); }
  };
  const onShow = () => { parked = false; reconcile(); };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    observer?.disconnect();
    media.removeEventListener('change', reconcile);
    document.removeEventListener('visibilitychange', reconcile);
    window.removeEventListener('pagehide', onHide);
    window.removeEventListener('pageshow', onShow);
    document.removeEventListener('astro:before-swap', dispose);
    for (const name of ['data-marquee-enhanced', 'data-marquee-ready', 'data-marquee-static', 'data-marquee-running']) root.removeAttribute(name);
    mounted.delete(root);
  };
  mounted.set(root, dispose);
  root.setAttribute('data-marquee-enhanced', '');
  media.addEventListener('change', reconcile);
  document.addEventListener('visibilitychange', reconcile);
  window.addEventListener('pagehide', onHide);
  window.addEventListener('pageshow', onShow);
  document.addEventListener('astro:before-swap', dispose);
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      const entry = entries.find(entry => entry.target === root);
      if (!entry) return;
      visible = entry.isIntersecting;
      if (visible) loadLogos();
      reconcile();
    });
    observer.observe(root);
  } else loadLogos();
  reconcile();
  return dispose;
}

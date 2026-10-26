/** Keep source CSS clocks intact: visibility only pauses/resumes them. */
const mounted = new WeakMap<HTMLElement, () => void>();

export function mountHeroStatusMotion(root: HTMLElement): () => void {
  const existing = mounted.get(root);
  if (existing) return existing;
  const lastRow = root.querySelector<HTMLElement>('.row:last-child');
  if (!lastRow) return () => {};
  const media = window.matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  let visible = !('IntersectionObserver' in window);
  let parked = false, disposed = false;
  let observer: IntersectionObserver | undefined;

  const reconcile = () => {
    if (disposed) return;
    root.toggleAttribute('data-status-static', media.matches);
    if (media.matches) root.setAttribute('data-status-entered', '');
    root.toggleAttribute('data-status-running', visible && !document.hidden && !parked && !media.matches);
  };
  const entered = (event: AnimationEvent) => {
    if (event.target === lastRow && event.animationName.startsWith('rise')) root.setAttribute('data-status-entered', '');
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
    root.removeEventListener('animationend', entered);
    media.removeEventListener('change', reconcile);
    document.removeEventListener('visibilitychange', reconcile);
    window.removeEventListener('pagehide', onHide);
    window.removeEventListener('pageshow', onShow);
    document.removeEventListener('astro:before-swap', dispose);
    root.removeAttribute('data-status-running');
    mounted.delete(root);
  };
  mounted.set(root, dispose);
  root.setAttribute('data-status-enhanced', '');
  root.addEventListener('animationend', entered);
  media.addEventListener('change', reconcile);
  document.addEventListener('visibilitychange', reconcile);
  window.addEventListener('pagehide', onHide);
  window.addEventListener('pageshow', onShow);
  document.addEventListener('astro:before-swap', dispose);
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      const entry = entries.find(entry => entry.target === root);
      if (entry) { visible = entry.isIntersecting; reconcile(); }
    });
    observer.observe(root);
  }
  reconcile();
  return dispose;
}

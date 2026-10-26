/** Preserve decorative CSS clocks, running only while visible and permitted. */
const mounted = new WeakMap<HTMLElement, () => void>();
export function mountAmbientPreview(root: HTMLElement, settle: () => void = () => {}): () => void {
  const existing = mounted.get(root);
  if (existing) return existing;
  if (!('IntersectionObserver' in window)) return () => {};
  const media = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  let visible = false, parked = false, disposed = false;
  const reconcile = () => {
    if (disposed) return;
    root.toggleAttribute('data-ambient-running', visible && !document.hidden && !parked && !media.matches);
    root.toggleAttribute('data-ambient-settled', media.matches);
    if (media.matches) settle();
  };
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; reconcile(); });
  const onHide = (event: PageTransitionEvent) => { if (!event.persisted) dispose(); else { parked = true; reconcile(); } };
  const onShow = () => { parked = false; reconcile(); };
  const dispose = () => {
    if (disposed) return;
    disposed = true; observer.disconnect();
    media.removeEventListener('change', reconcile); document.removeEventListener('visibilitychange', reconcile);
    window.removeEventListener('pagehide', onHide); window.removeEventListener('pageshow', onShow);
    document.removeEventListener('astro:before-swap', dispose);
    root.removeAttribute('data-ambient-running'); mounted.delete(root);
  };
  mounted.set(root, dispose); root.setAttribute('data-ambient-enhanced', ''); observer.observe(root);
  media.addEventListener('change', reconcile); document.addEventListener('visibilitychange', reconcile);
  window.addEventListener('pagehide', onHide); window.addEventListener('pageshow', onShow);
  document.addEventListener('astro:before-swap', dispose); reconcile(); return dispose;
}

/** Approved yourITis.html sequence; independent of service animation replay. */
const mounted = new WeakMap<HTMLElement, () => void>();
export function mountHeroHeadline(root: HTMLElement): () => void {
  const existing = mounted.get(root);
  if (existing) return existing;
  const roles = Array.from(root.querySelectorAll<HTMLElement>('.itk-hero-role'));
  const rotator = root.querySelector<HTMLElement>('.itk-hero-rotator');
  if (roles.length !== 7 || !rotator) return () => {};
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let returned = false;
  let remaining = 2700;
  let since = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let frame: number | undefined;
  let visible = true;
  let parked = false;
  let disposed = false;
  let observer: IntersectionObserver | undefined;

  const activate = () => {
    frame = undefined;
    roles.forEach((role, index) => {
      role.classList.toggle('is-active', index === current);
      role.classList.toggle('is-leaving', index === (current + roles.length - 1) % roles.length);
    });
  };
  const advance = () => {
    timer = undefined;
    const isReturn = current === roles.length - 1;
    current = (current + 1) % roles.length;
    if (isReturn) returned = true;
    rotator.classList.toggle('itk-hero-rotator--slow', isReturn);
    const incoming = roles[current];
    incoming.classList.add('no-anim');
    incoming.classList.remove('is-active', 'is-leaving');
    void incoming.offsetWidth;
    incoming.classList.remove('no-anim');
    frame = requestAnimationFrame(activate);
    remaining = (isReturn ? 540 : 460) + (current === 0 ? (returned ? 3000 : 2700) : 1800);
    reconcile();
  };
  const reconcile = () => {
    if (disposed) return;
    if (!visible || document.hidden || parked) {
      if (timer !== undefined) {
        clearTimeout(timer); timer = undefined;
        remaining = Math.max(0, remaining - (performance.now() - since));
      }
      // Complete an already queued swap without leaving a pending frame offscreen.
      if (frame !== undefined) { cancelAnimationFrame(frame); activate(); }
    } else if (timer === undefined) {
      since = performance.now();
      timer = setTimeout(advance, remaining);
    }
  };
  const preference = () => { root.toggleAttribute('data-reduced', media.matches); };
  const pagehide = (event: PageTransitionEvent) => {
    if (!event.persisted) { dispose(); return; }
    parked = true; reconcile();
  };
  const pageshow = () => { parked = false; reconcile(); };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    clearTimeout(timer);
    if (frame !== undefined) cancelAnimationFrame(frame);
    observer?.disconnect();
    document.removeEventListener('visibilitychange', reconcile);
    media.removeEventListener('change', preference);
    window.removeEventListener('pagehide', pagehide);
    window.removeEventListener('pageshow', pageshow);
    mounted.delete(root);
  };
  mounted.set(root, dispose);
  preference();
  root.setAttribute('data-enhanced', '');
  media.addEventListener('change', preference);
  document.addEventListener('visibilitychange', reconcile);
  window.addEventListener('pagehide', pagehide);
  window.addEventListener('pageshow', pageshow);
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.target === root);
      if (entry) { visible = entry.isIntersecting; reconcile(); }
    });
    observer.observe(root);
  }
  reconcile();
  return dispose;
}

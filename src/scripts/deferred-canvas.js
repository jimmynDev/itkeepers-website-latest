/** Prepare this below-fold canvas near the viewport, retaining the same renderer. */
export function createDeferredCanvas(root, factory, duration = 12000) {
  let renderer, observer, disposed = false;
  const prepare = () => {
    if (!disposed && !renderer) renderer = factory(root);
    return renderer;
  };
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      if (!disposed && entries.some(entry => entry.target === root && entry.isIntersecting)) {
        try { prepare(); } catch { observer?.disconnect(); /* Lifecycle retries safely or restores its static fallback. */ }
      }
    }, { rootMargin: '160px 0px', threshold: 0 });
    observer.observe(root);
  }
  return {
    duration,
    play() { prepare()?.play(); },
    // Reduced motion / missing lifecycle observer still receives the exact final frame.
    settle() { prepare()?.settle(); },
    dispose() { disposed = true; observer?.disconnect(); renderer?.dispose(); }
  };
}

const mounted = new WeakMap<HTMLElement, () => void>();
const rotationDelay = 10_000;
const halfFade = 175; // Sequential fade out/in: 350ms, never two visible quotes.

export function initializeClientProofCarousel(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>('[data-proof-carousel]').forEach(root => {
    if (mounted.has(root)) return;
    const slides = [...root.querySelectorAll<HTMLElement>('[data-proof-slide]')];
    const stage = root.querySelector<HTMLElement>('[data-proof-stage]');
    const navigation = root.querySelector<HTMLElement>('[data-proof-navigation]');
    const previous = root.querySelector<HTMLButtonElement>('[data-proof-previous]');
    const next = root.querySelector<HTMLButtonElement>('[data-proof-next]');
    const rotation = root.querySelector<HTMLButtonElement>('[data-proof-rotation]');
    const icon = root.querySelector<HTMLElement>('[data-proof-rotation-icon]');
    const status = root.querySelector<HTMLElement>('[data-proof-quote-status]');
    const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-proof-dot]')];
    if (slides.length < 2 || !stage || !navigation || !previous || !next) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0, desired = 0;
    let hovered = root.matches(':hover');
    let focused = root.contains(document.activeElement);
    let manuallyPaused = false, pageHidden = false, disposed = false;
    let automaticFade = false;
    let visible = !('IntersectionObserver' in window);
    let remaining = rotationDelay, since = 0;
    let observer: IntersectionObserver | undefined;
    let autoTimer: ReturnType<typeof setTimeout> | undefined;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const clearAuto = (preserve = false) => {
      if (preserve && autoTimer !== undefined) remaining = Math.max(0, remaining - (performance.now() - since));
      else if (!preserve) remaining = rotationDelay;
      clearTimeout(autoTimer); autoTimer = undefined;
    };
    const clearFade = () => { clearTimeout(fadeTimer); clearTimeout(settleTimer); fadeTimer = settleTimer = undefined; automaticFade = false; stage.dataset.phase = 'idle'; };
    const pauseAutomatic = (preserve = false) => {
      clearAuto(preserve);
      if (automaticFade) { clearFade(); desired = current; }
    };
    const paused = () => !visible || manuallyPaused || hovered || focused || document.hidden || pageHidden || reduced.matches;
    const schedule = () => {
      clearAuto(true);
      if (!disposed && !paused()) { since = performance.now(); autoTimer = setTimeout(() => { autoTimer = undefined; remaining = rotationDelay; go((current + 1) % slides.length, false); }, remaining); }
    };
    const show = (index: number) => {
      current = index;
      slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', String(i !== index));
        slide.inert = i !== index;
      });
      dots.forEach((dot, i) => {
        if (i === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      root.dataset.activeQuote = String(index);
    };
    const announce = () => {
      if (status) status.textContent = `Testimonial ${current + 1} of ${slides.length}${slides[current].querySelector('cite')?.textContent ? `: ${slides[current].querySelector('cite')!.textContent}` : ''}.`;
    };
    const go = (index: number, manual: boolean) => {
      if (disposed) return;
      // With no separate pause button, manual navigation stops rotation for this visit.
      if (manual && !rotation) manuallyPaused = true;
      desired = (index + slides.length) % slides.length;
      clearAuto(); clearFade();
      if (desired === current) { schedule(); return; }
      if (reduced.matches) { show(desired); if (manual) announce(); schedule(); return; }
      stage.dataset.phase = 'out';
      automaticFade = !manual;
      fadeTimer = setTimeout(() => {
        show(desired);
        stage.dataset.phase = 'in';
        // Commit the new slide's zero-opacity state before its fade in.
        void slides[current].offsetWidth;
        stage.dataset.phase = 'idle';
        if (manual) announce();
        settleTimer = setTimeout(() => { settleTimer = undefined; automaticFade = false; schedule(); }, halfFade);
      }, halfFade);
    };
    const onPrevious = () => go(desired - 1, true);
    const onNext = () => go(desired + 1, true);
    const onDot = (event: Event) => go(Number((event.currentTarget as HTMLButtonElement).dataset.proofDot), true);
    const updateRotation = () => {
      if (!rotation) return;
      rotation.disabled = reduced.matches;
      const label = reduced.matches ? 'Automatic rotation off: reduced motion' : manuallyPaused ? 'Resume automatic rotation' : 'Pause automatic rotation';
      rotation.setAttribute('aria-label', label); rotation.title = label;
      rotation.setAttribute('aria-pressed', String(manuallyPaused || reduced.matches));
      if (icon) icon.textContent = manuallyPaused || reduced.matches ? '▶' : 'Ⅱ';
    };
    const onRotation = () => { manuallyPaused = !manuallyPaused; if (manuallyPaused) pauseAutomatic(); updateRotation(); schedule(); };
    const onEnter = () => { hovered = true; pauseAutomatic(); };
    const onLeave = () => { hovered = false; schedule(); };
    const onFocus = () => { focused = true; pauseAutomatic(); };
    const onBlur = (event: FocusEvent) => {
      if (root.contains(event.relatedTarget as Node | null)) return;
      focused = false; schedule();
    };
    const onVisibility = () => { if (document.hidden) pauseAutomatic(); else schedule(); };
    const onPageHide = () => { pageHidden = true; clearAuto(); clearFade(); show(desired); };
    const onPageShow = () => { pageHidden = false; schedule(); };
    const onReduced = () => { clearAuto(); clearFade(); show(desired); updateRotation(); schedule(); };
    root.addEventListener('mouseenter', onEnter); root.addEventListener('mouseleave', onLeave);
    root.addEventListener('focusin', onFocus); root.addEventListener('focusout', onBlur);
    previous.addEventListener('click', onPrevious); next.addEventListener('click', onNext);
    rotation?.addEventListener('click', onRotation); dots.forEach(dot => dot.addEventListener('click', onDot));
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide); window.addEventListener('pageshow', onPageShow);
    reduced.addEventListener('change', onReduced);
    const dispose = () => {
      disposed = true; clearAuto(); clearFade(); observer?.disconnect();
      root.removeEventListener('mouseenter', onEnter); root.removeEventListener('mouseleave', onLeave);
      root.removeEventListener('focusin', onFocus); root.removeEventListener('focusout', onBlur);
      previous.removeEventListener('click', onPrevious); next.removeEventListener('click', onNext);
      rotation?.removeEventListener('click', onRotation); dots.forEach(dot => dot.removeEventListener('click', onDot));
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide); window.removeEventListener('pageshow', onPageShow);
      reduced.removeEventListener('change', onReduced);
      document.removeEventListener('astro:before-swap', dispose);
      mounted.delete(root);
    };
    mounted.set(root, dispose);
    document.addEventListener('astro:before-swap', dispose, { once: true });
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        const entry = entries.find(entry => entry.target === root);
        if (!entry || disposed) return;
        visible = entry.isIntersecting;
        if (visible) schedule(); else pauseAutomatic(true);
      });
      observer.observe(root);
    }
    show(0); updateRotation(); navigation.hidden = false; schedule();
  });
}

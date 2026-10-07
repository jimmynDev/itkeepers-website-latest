const page = document.querySelector<HTMLElement>('.home-page');
const wash = page?.querySelector<HTMLElement>('.home-pointer-light');
if (page && wash) {
  const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let frame = 0;
  let active = false;
  let tone = 'cyan';
  let service: HTMLElement | null = null;
  let lightBounds: HTMLElement | null = null;
  let litService: HTMLElement | null = null;
  const draw = () => {
    frame = 0;
    wash.style.transform = `translate3d(${x - 500}px, ${y - 500}px, 0)`;
    const next = active && allowed.matches ? service : null;
    wash.style.opacity = active && allowed.matches && !next ? '1' : '0';
    wash.dataset.tone = tone;
    if (litService && litService !== next) litService.style.removeProperty('--service-pointer-visible');
    if (next) {
      const bounds = (lightBounds ?? next).getBoundingClientRect();
      next.style.setProperty('--service-pointer-x', `${x - bounds.left}px`);
      next.style.setProperty('--service-pointer-y', `${y - bounds.top}px`);
      next.style.setProperty('--service-pointer-visible', '1');
    }
    litService = next;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
  const stop = () => { active = false; schedule(); };
  page.addEventListener('pointermove', event => {
    if (!allowed.matches || event.pointerType !== 'mouse') return;
    x = event.clientX; y = event.clientY; active = true;
    tone = (event.target as Element).closest<HTMLElement>('[data-light]')?.dataset.light ?? 'cyan';
    const target = event.target as Element;
    service = target.closest<HTMLElement>('.service-story');
    const digital = service ? null : target.closest<HTMLElement>('.digital-bridge');
    lightBounds = service ?? digital;
    if (digital) service = digital.closest<HTMLElement>('.digital-transition-zone');
    schedule();
  }, { passive: true });
  page.addEventListener('pointerleave', stop);
  allowed.addEventListener('change', stop);
  addEventListener('blur', stop);
  addEventListener('scroll', stop, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  // Content is visible before this one-shot, transform-only entrance is enabled.
  if (allowed.matches) page.classList.add('home-motion-ready');
}

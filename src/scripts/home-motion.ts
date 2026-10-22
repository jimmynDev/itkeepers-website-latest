const page = document.querySelector<HTMLElement>('.home-page');
const wash = page?.querySelector<HTMLElement>('.home-pointer-light');
if (page && wash) {
  const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
  let x = 0;
  let y = 0;
  let frame = 0;
  let active = false;
  const draw = () => {
    frame = 0;
    wash.style.transform = `translate3d(${x - 500}px, ${y - 500}px, 0)`;
    wash.style.opacity = active && allowed.matches ? '1' : '0';
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
  const stop = () => { active = false; schedule(); };
  // One viewport coordinate system, regardless of section, scroll or theme.
  page.addEventListener('pointermove', event => {
    if (!allowed.matches || event.pointerType !== 'mouse') return;
    x = event.clientX; y = event.clientY; active = true;
    schedule();
  }, { passive: true });
  page.addEventListener('pointerleave', stop);
  page.addEventListener('pointercancel', stop);
  page.addEventListener('keydown', event => { if (event.key === 'Tab') stop(); });
  allowed.addEventListener('change', stop);
  addEventListener('blur', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  // Content is visible before this one-shot, transform-only entrance is enabled.
  if (allowed.matches) page.classList.add('home-motion-ready');
}

const page = document.querySelector<HTMLElement>('.home-page');
const wash = page?.querySelector<HTMLElement>('.home-pointer-light');
if (page && wash) {
  const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let frame = 0;
  let active = false;
  let tone = 'cyan';
  const draw = () => {
    frame = 0;
    wash.style.transform = `translate3d(${x - 500}px, ${y - 500}px, 0)`;
    wash.style.opacity = active && allowed.matches ? '1' : '0';
    wash.dataset.tone = tone;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
  const stop = () => { active = false; schedule(); };
  page.addEventListener('pointermove', event => {
    if (!allowed.matches || event.pointerType !== 'mouse') return;
    x = event.clientX; y = event.clientY; active = true;
    tone = (event.target as Element).closest<HTMLElement>('[data-light]')?.dataset.light ?? 'cyan';
    schedule();
  }, { passive: true });
  page.addEventListener('pointerleave', stop);
  allowed.addEventListener('change', stop);
  addEventListener('blur', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  // Content is visible before this one-shot, transform-only entrance is enabled.
  if (allowed.matches) page.classList.add('home-motion-ready');
}

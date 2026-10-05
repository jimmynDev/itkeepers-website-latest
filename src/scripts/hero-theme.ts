/** Theme pilot: the homepage hero and its navigation change appearance. */
export function mountHeroTheme(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-hero-theme-toggle]');
  const hero = document.querySelector<HTMLElement>('.home-hero');
  if (!button || !hero) return;
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let transition: ViewTransition | undefined;
  let selectedTheme = 'day';
  const apply = (theme: string) => {
    const night = theme === 'night';
    root.dataset.heroTheme = night ? 'night' : 'day';
    button.setAttribute('aria-pressed', String(night));
    button.setAttribute('aria-label', night ? 'Switch to day mode' : 'Switch to night mode');
    button.querySelector<HTMLElement>('[data-theme-icon]')!.textContent = night ? '☾' : '☀';
    button.title = night ? 'Switch to day mode' : 'Switch to night mode';
    selectedTheme = night ? 'night' : 'day';
  };
  const hour = new Date().getHours();
  apply(hour >= 7 && hour < 19 ? 'day' : 'night');
  button.hidden = false;
  button.addEventListener('click', () => {
    const theme = selectedTheme === 'night' ? 'day' : 'night';
    selectedTheme = theme;
    transition?.skipTransition();
    if (document.startViewTransition && !reducedMotion.matches) {
      transition = document.startViewTransition(() => apply(theme));
      transition.ready.catch(() => {});
      transition.finished.catch(() => {});
    } else {
      apply(theme);
    }
  });
  const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame = 0;
  let x = 0;
  let y = 0;
  const clear = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    delete hero.dataset.mouseLight;
  };
  hero.addEventListener('pointermove', event => {
    if (!allowed.matches || event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    x = event.clientX - bounds.left;
    y = event.clientY - bounds.top;
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      hero.style.setProperty('--hero-mouse-x', `${x}px`);
      hero.style.setProperty('--hero-mouse-y', `${y}px`);
      hero.dataset.mouseLight = '';
    });
  }, { passive: true });
  hero.addEventListener('pointerleave', clear);
  allowed.addEventListener('change', clear);
  window.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
}

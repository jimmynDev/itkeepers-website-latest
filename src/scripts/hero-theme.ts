/** Theme pilot: the homepage hero and its navigation change appearance. */
export function mountHeroTheme(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-hero-theme-toggle]');
  const hero = document.querySelector<HTMLElement>('.home-hero');
  if (!button || !hero) return;
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let transition: ViewTransition | undefined;
  let selectedTheme = 'night';
  const apply = (theme: string) => {
    const night = theme === 'night';
    root.dataset.heroTheme = night ? 'night' : 'day';
    button.setAttribute('aria-pressed', String(night));
    button.setAttribute('aria-label', night ? 'Switch to day mode' : 'Switch to night mode');
    button.querySelector<HTMLElement>('[data-theme-icon]')!.textContent = night ? '☾' : '☀';
    button.title = night ? 'Switch to day mode' : 'Switch to night mode';
    selectedTheme = night ? 'night' : 'day';
  };
  apply('night');
  button.hidden = button.hasAttribute('data-theme-control-paused');
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
}

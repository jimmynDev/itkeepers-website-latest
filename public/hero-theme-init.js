// Apply the approved dark default before the homepage paints.
(() => {
  const root = document.documentElement;
  root.dataset.heroTheme = 'night';
  root.setAttribute('data-home-enhanced','');
  // A failed complete stylesheet must never leave later content hidden.
  // Without this bootstrap (including no-JS), containment is not enabled.
  document.addEventListener('error', event => {
    if (event.target instanceof HTMLLinkElement && event.target.hasAttribute('data-home-full'))
      root.removeAttribute('data-home-enhanced');
  }, true);
})();

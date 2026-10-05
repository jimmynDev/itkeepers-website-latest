// Set the visitor's local-time theme before the styles paint the hero.
(() => {
  const hour = new Date().getHours();
  document.documentElement.dataset.heroTheme = hour >= 7 && hour < 19 ? 'day' : 'night';
})();

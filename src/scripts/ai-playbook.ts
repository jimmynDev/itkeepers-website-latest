const storageKey = 'itkeepers.aiGovernancePlaybook';
const dismissalPeriod = 14 * 24 * 60 * 60 * 1000;
type PlaybookState = { engaged?: boolean; dismissedAt?: number };
let memoryState: PlaybookState = {};
function readState(): PlaybookState {
  try { const state = JSON.parse(localStorage.getItem(storageKey) || '{}'); return state && typeof state === 'object' ? state : {}; }
  catch { return memoryState; }
}
function saveState(state: PlaybookState) {
  memoryState = state;
  try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Current document fallback. */ }
}
function eligible() {
  const state = readState();
  return !state.engaged && !(typeof state.dismissedAt === 'number' && Date.now() - state.dismissedAt < dismissalPeriod);
}
function initializePlaybook() {
  if (window.location.pathname !== '/') return;
  const card = document.querySelector<HTMLElement>('.playbook-card');
  if (!card || card.dataset.initialized) return;
  card.dataset.initialized = 'true';
  let timer: ReturnType<typeof setTimeout> | undefined;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;
  let frame = 0;
  let shown = false;
  let returnFocus: HTMLElement | null = null;
  const stopTriggers = () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  // Keep fixed controls and the current keyboard focus clear of the card.
  const position = () => {
    frame = 0;
    if (card.hidden) return;
    card.style.setProperty('--playbook-offset', '0px');
    const rect = card.getBoundingClientRect();
    let offset = 0;
    document.querySelectorAll<HTMLElement>('a,button,[role="button"],[data-floating-control]').forEach(control => {
      if (card.contains(control)) return;
      const style = getComputedStyle(control);
      if (style.visibility === 'hidden' || style.display === 'none' || style.pointerEvents === 'none') return;
      let parent: HTMLElement | null = control;
      let floating = false;
      while (parent && parent !== document.body) {
        if (['fixed', 'sticky'].includes(getComputedStyle(parent).position)) { floating = true; break; }
        parent = parent.parentElement;
      }
      if (!floating && control !== document.activeElement) return;
      const other = control.getBoundingClientRect();
      if (other.width && other.height && other.top > window.innerHeight / 2 && other.top < window.innerHeight && other.right > rect.left && other.left < rect.right) {
        offset = Math.max(offset, window.innerHeight - other.top + 12 - (window.innerWidth <= 650 ? 16 : 24));
      }
    });
    card.style.setProperty('--playbook-offset', `${Math.max(0, offset)}px`);
  };
  const schedulePosition = () => { if (!card.hidden && !frame) frame = requestAnimationFrame(position); };
  const hide = (animate = true) => {
    stopTriggers();
    if (card.contains(document.activeElement)) {
      const visible = (control: HTMLElement) => {
        if (!control.isConnected || card.contains(control) || control.closest('[hidden],[inert]')) return false;
        const rect = control.getBoundingClientRect();
        const style = getComputedStyle(control);
        const top = control.closest('.site-header') ? 0 : document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0 && rect.top >= top && rect.bottom <= window.innerHeight && rect.left >= 0 && rect.right <= window.innerWidth;
      };
      const controls = [...document.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),summary,[tabindex="0"]')].filter(visible);
      const target = returnFocus && visible(returnFocus) ? returnFocus : controls.find(control => control.closest('main')) ?? controls[0] ?? document.querySelector<HTMLElement>('#main-content');
      card.inert = true;
      target?.focus({ preventScroll: true });
    }
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { card.hidden = true; return; }
    card.classList.add('is-closing');
    hideTimer = setTimeout(() => { card.hidden = true; }, 220);
  };
  const show = () => {
    if (shown || !eligible()) { stopTriggers(); return; }
    shown = true;
    stopTriggers();
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    card.inert = false;
    card.hidden = false;
    position();
    card.dispatchEvent(new CustomEvent('ai-playbook-view', { bubbles: true }));
  };
  function onScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable > 0 && window.scrollY / scrollable >= 0.22) show();
  }
  card.querySelector<HTMLButtonElement>('.playbook-close')?.addEventListener('click', () => {
    saveState({ ...readState(), dismissedAt: Date.now() });
    hide();
  });
  document.querySelectorAll<HTMLAnchorElement>('a[data-event="ai-playbook-open"]').forEach(link => link.addEventListener('click', () => {
    saveState({ engaged: true });
    hide(false);
  }));
  const onStorage = (event: StorageEvent) => { if (event.key === storageKey && !eligible()) hide(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener('resize', schedulePosition, { passive: true });
  window.addEventListener('scroll', schedulePosition, { passive: true });
  document.addEventListener('focusin', schedulePosition);
  document.addEventListener('astro:before-swap', () => {
    stopTriggers(); clearTimeout(hideTimer); cancelAnimationFrame(frame);
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('resize', schedulePosition);
    window.removeEventListener('scroll', schedulePosition);
    document.removeEventListener('focusin', schedulePosition);
  }, { once: true });
  if (eligible()) { timer = setTimeout(show, 6000); window.addEventListener('scroll', onScroll, { passive: true }); }
}
initializePlaybook();
document.addEventListener('astro:page-load', initializePlaybook);

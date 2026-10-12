/** Site navigation disclosures, with ordinary links and Tab behavior. */
export function mountNavigation(): void {
  const header = document.querySelector<HTMLElement>('[data-mega-header]');
  if (!header || header.dataset.navigationMounted) return;
  const desktop = header.querySelector<HTMLElement>('[data-desktop-navigation]');
  const mobile = header.querySelector<HTMLDetailsElement>('[data-mobile-navigation]');
  const summary = mobile?.querySelector<HTMLElement>('summary');
  // Incomplete markup can briefly occur during development hot replacement.
  if (!desktop || !mobile || !summary) return;
  header.dataset.navigationMounted = 'true';
  const categories = [...desktop.querySelectorAll<HTMLElement>('[data-nav-category]')];
  const toggles = [...mobile.querySelectorAll<HTMLButtonElement>('[data-mobile-toggle]')];
  const desktopMode = window.matchMedia('(min-width: 1440px)');
  const hoverMode = window.matchMedia('(hover: hover) and (pointer: fine)');
  const removers: (() => void)[] = [];
  let active: HTMLElement | null = null;
  let openTimer: ReturnType<typeof setTimeout> | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  let heightFrame = 0;
  let disposed = false;
  function listen(target: EventTarget, name: string, handler: EventListener) {
    target.addEventListener(name, handler);
    removers.push(() => target.removeEventListener(name, handler));
  }
  const cancelTimers = () => { clearTimeout(openTimer); clearTimeout(closeTimer); };
  const desktopToggle = (category: HTMLElement) => category.querySelector<HTMLButtonElement>('[data-nav-toggle]')!;
  const desktopPanel = (category: HTMLElement) => category.querySelector<HTMLElement>('[data-nav-panel]')!;
  function closeDesktop(restore = false) {
    cancelTimers();
    if (!active) return;
    const toggle = desktopToggle(active);
    desktopPanel(active).hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    active = null;
    if (restore) toggle.focus({ preventScroll: true });
  }
  function openDesktop(category: HTMLElement) {
    cancelTimers();
    if (!desktopMode.matches || disposed) return;
    if (active === category) return;
    // Hover must never hide the currently focused disclosure.
    if (active && desktopPanel(active).contains(document.activeElement)) return;
    closeDesktop();
    active = category;
    desktopPanel(category).hidden = false;
    desktopToggle(category).setAttribute('aria-expanded', 'true');
  }
  function closeMobileCategories() {
    toggles.forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
      document.getElementById(toggle.getAttribute('aria-controls')!)!.hidden = true;
    });
  }
  function closeMobile(restore = false) {
    mobile.open = false;
    closeMobileCategories();
    if (restore) summary.focus({ preventScroll: true });
  }
  const scheduleClose = () => {
    cancelTimers();
    closeTimer = setTimeout(() => {
      if (active && !active.contains(document.activeElement)) closeDesktop();
    }, 200);
  };
  categories.forEach(category => {
    const toggle = desktopToggle(category);
    toggle.hidden = false;
    listen(category, 'pointerenter', ((event: PointerEvent) => {
      if (!desktopMode.matches || !hoverMode.matches || event.pointerType === 'touch') return;
      cancelTimers();
      openTimer = setTimeout(() => openDesktop(category), 125);
    }) as EventListener);
    listen(category, 'pointerleave', scheduleClose);
    listen(desktopPanel(category), 'pointerenter', cancelTimers);
    listen(toggle, 'click', () => { active === category ? closeDesktop() : openDesktop(category); });
    listen(category, 'focusin', () => {
      cancelTimers();
      if (active && active !== category) closeDesktop();
    });
    listen(category, 'focusout', ((event: FocusEvent) => {
      if (!category.contains(event.relatedTarget as Node | null)) closeDesktop();
    }) as EventListener);
  });
  toggles.forEach(toggle => {
    toggle.hidden = false;
    listen(toggle, 'click', () => {
      const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
      closeMobileCategories();
      if (!wasOpen) {
        toggle.setAttribute('aria-expanded', 'true');
        document.getElementById(toggle.getAttribute('aria-controls')!)!.hidden = false;
      }
    });
  });
  listen(mobile, 'toggle', () => {
    summary.setAttribute('aria-expanded', String(mobile.open));
    if (!mobile.open) closeMobileCategories();
  });
  summary.setAttribute('aria-expanded', String(mobile.open));
  listen(header, 'keydown', ((event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    if (desktopMode.matches && active) { event.preventDefault(); closeDesktop(true); }
    else if (!desktopMode.matches && mobile.open) { event.preventDefault(); closeMobile(true); }
  }) as EventListener);
  listen(document, 'pointerdown', ((event: PointerEvent) => {
    if (header.contains(event.target as Node)) return;
    closeDesktop(Boolean(active && desktopPanel(active).contains(document.activeElement)));
    // Restore a focused drawer control before hiding it on outside dismissal.
    if (mobile.open) closeMobile(mobile.contains(document.activeElement));
  }) as EventListener);
  listen(mobile, 'focusout', ((event: FocusEvent) => {
    if (event.relatedTarget && !mobile.contains(event.relatedTarget as Node)) closeMobile();
  }) as EventListener);
  listen(mobile, 'click', ((event: MouseEvent) => {
    const link = (event.target as Element).closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    closeMobile(true);
  }) as EventListener);
  const onModeChange = () => {
    const focused = document.activeElement;
    closeDesktop();
    closeMobile();
    if (desktopMode.matches && mobile.contains(focused)) categories[0].querySelector<HTMLAnchorElement>('a')!.focus({ preventScroll: true });
    else if (!desktopMode.matches && desktop.contains(focused)) summary.focus({ preventScroll: true });
  };
  listen(desktopMode, 'change', onModeChange);
  listen(window, 'blur', () => {
    closeDesktop(Boolean(active && desktopPanel(active).contains(document.activeElement)));
    if (mobile.open) closeMobile(mobile.contains(document.activeElement));
  });
  // Account for text resize and short viewports while retaining existing header height.
  const measure = () => {
    heightFrame = 0;
    header.style.setProperty('--navigation-bottom', `${Math.ceil(header.getBoundingClientRect().bottom)}px`);
  };
  const scheduleMeasure = () => { cancelAnimationFrame(heightFrame); heightFrame = requestAnimationFrame(measure); };
  const observer = new ResizeObserver(scheduleMeasure);
  observer.observe(header);
  listen(window, 'resize', scheduleMeasure);
  measure();
  function dispose() {
    disposed = true;
    closeDesktop();
    closeMobile();
    cancelAnimationFrame(heightFrame);
    observer.disconnect();
    removers.forEach(remove => remove());
    delete header.dataset.navigationMounted;
  }
  listen(document, 'astro:before-swap', dispose);
}

document.addEventListener('astro:page-load', mountNavigation);

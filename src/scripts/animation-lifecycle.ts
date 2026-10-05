/** Viewport-aware, replayable timelines; continuous playback is explicitly opt-in. */
type Timeline = { play: () => void; settle: () => void; duration: number };
type Scheduler = { later: (callback: () => void, delay: number) => void };
type Task = { callback: () => void; remaining: number; since: number; timer?: ReturnType<typeof setTimeout> };

const mounted = new WeakMap<HTMLElement, () => void>();

export function mountAnimation(root: HTMLElement, factory: (scheduler: Scheduler) => Timeline, options: { loop?: boolean } = {}): () => void {
  const existing = mounted.get(root);
  if (existing) return existing;
  const button = root.querySelector<HTMLButtonElement>('[data-animation-toggle]');
  const visual = root.querySelector<HTMLElement>('[data-animation-visual]');
  const fallback = visual && { html: visual.innerHTML, className: visual.className, style: visual.getAttribute('style') };
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const entrance = Boolean(root.closest?.('.service-story'));
  const tasks = new Set<Task>();
  let timeline: Timeline | undefined;
  const observers: IntersectionObserver[] = [];
  let started = false;
  let running = false;
  let settled = false;
  let disposed = false;
  let visible = false;
  let entered = false;
  let replayReady = false;
  let staticOnly = false;
  let userPaused = false;
  let parked = false;
  let entering = false;
  let entranceComplete = false;
  const present = (value: string) => {
    if (!entrance) return;
    root.dataset.animationEntrance = value;
    if (visual) visual.inert = value !== 'shown';
  };

  const state = (value: string) => {
    root.dataset.animationState = value;
    if (value === 'settled') present('shown');
    root.classList.toggle('is-idle', value !== 'running');
    if (button) {
      // Keep a focused control in place when the sequence completes naturally.
      const focusedCompletion = settled && document.activeElement === button;
      button.hidden = !focusedCompletion && (!started || settled || disposed);
      button.setAttribute('aria-disabled', settled ? 'true' : 'false');
      button.textContent = settled ? 'Animation complete' : userPaused ? 'Resume animation' : 'Pause animation';
    }
  };
  const cancel = () => {
    for (const task of tasks) clearTimeout(task.timer);
    tasks.clear();
  };
  const restore = (failed = false) => {
    // Re-enable the component's readable, no-JavaScript fallback CSS.
    if (failed) delete root.dataset.animationEnhanced;
    if (!visual || !fallback) return;
    visual.innerHTML = fallback.html;
    visual.className = fallback.className;
    if (fallback.style === null) visual.removeAttribute('style');
    else visual.setAttribute('style', fallback.style);
  };
  const finish = (failed = false) => {
    if (settled) return;
    settled = true;
    running = false;
    cancel();
    if (failed) { staticOnly = true; observers.forEach(observer => observer.disconnect()); }
    // Disable transition effects before writing the meaningful final state.
    state('settled');
    try {
      if (failed || !timeline) restore(true);
      else timeline.settle();
    } catch {
      staticOnly = true;
      observers.forEach(observer => observer.disconnect());
      restore(true);
    }
  };
  const arm = (task: Task) => {
    task.since = performance.now();
    task.timer = setTimeout(() => {
      tasks.delete(task);
      if (!running || settled || disposed) return;
      try { task.callback(); } catch { finish(true); }
    }, task.remaining);
  };
  const later: Scheduler['later'] = (callback, delay) => {
    if (settled || disposed) return;
    const task: Task = { callback, remaining: Math.max(0, Number.isFinite(delay) ? delay : 0), since: 0 };
    tasks.add(task);
    if (running) arm(task);
  };
  const pause = () => {
    if (!running) return;
    running = false;
    const now = performance.now();
    for (const task of tasks) {
      clearTimeout(task.timer);
      task.remaining = Math.max(0, task.remaining - (now - task.since));
    }
    state('paused');
  };
  const startSequence = () => {
    entering = false;
    started = true;
    entranceComplete = true;
    present('shown');
    state('running');
    try {
      timeline!.play();
      if (!options.loop) later(() => finish(), timeline!.duration);
    } catch { finish(true); }
  };
  const reconcile = () => {
    if (disposed || staticOnly) return;
    if (media.matches) {
      staticOnly = true;
      replayReady = false;
      observers.forEach(observer => observer.disconnect());
      finish();
      state('settled');
      return;
    }
    if (!visible || document.hidden || userPaused || parked) { pause(); return; }
    if (replayReady) {
      if (!entered) return;
      // Restore pristine visual markup before recapturing component references.
      // This also removes generated network overlays and all prior state classes.
      cancel();
      settled = false;
      started = false;
      entering = false;
      entranceComplete = false;
      replayReady = false;
      state('waiting');
      present('waiting');
      restore();
      try { initialize(); } catch { finish(true); return; }
      // Commit the restored starting styles before play changes state classes.
      visual?.getBoundingClientRect();
    }
    if (settled || (!started && !entered)) return;
    if (running) return;
    running = true;
    state(entering ? 'entering' : 'running');
    for (const task of tasks) arm(task);
    if (!started && !entering) {
      if (entrance && !entranceComplete) {
        entering = true;
        present('entering');
        state('entering');
        later(startSequence, 600);
      } else startSequence();
    }
  };
  const toggle = () => {
    if (settled || disposed) return;
    userPaused = !userPaused;
    reconcile();
    if (!settled) state(running ? (entering ? 'entering' : 'running') : 'paused');
  };
  const pagehide = (event: PageTransitionEvent) => {
    if (!event.persisted) { dispose(); return; }
    parked = true;
    pause();
  };
  const pageshow = () => { parked = false; reconcile(); };
  const dispose = () => {
    if (disposed) return;
    finish();
    disposed = true;
    observers.forEach(observer => observer.disconnect());
    button?.removeEventListener('click', toggle);
    document.removeEventListener('visibilitychange', reconcile);
    media.removeEventListener('change', reconcile);
    window.removeEventListener('pagehide', pagehide);
    window.removeEventListener('pageshow', pageshow);
    mounted.delete(root);
  };

  mounted.set(root, dispose);
  root.dataset.animationEnhanced = 'true';
  present('waiting');
  state('waiting');
  const initialize = () => {
    timeline = factory({ later });
    if (!Number.isFinite(timeline.duration) || timeline.duration < 0) throw new Error('Invalid timeline duration');
  };
  try { initialize(); } catch {
    finish(true);
    return dispose;
  }
  if (media.matches || !('IntersectionObserver' in window)) {
    staticOnly = true;
    finish();
    return dispose;
  }
  button?.addEventListener('click', toggle);
  document.addEventListener('visibilitychange', reconcile);
  media.addEventListener('change', reconcile);
  window.addEventListener('pagehide', pagehide);
  window.addEventListener('pageshow', pageshow);
  const observe = (rootMargin: string, update: (intersects: boolean) => void) => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.target === root);
      if (!entry || disposed || staticOnly) return;
      update(entry.isIntersecting);
    }, { rootMargin, threshold: 0 });
    observers.push(observer);
    observer.observe(root);
  };
  // Separate spatial boundaries provide hysteresis without polling or exit timers.
  // A glimpse at the viewport edge cannot start or reset the major sequence.
  observe('0px', intersects => { visible = intersects; reconcile(); });
  observe('-96px 0px', intersects => { entered = intersects; reconcile(); });
  observe('160px 0px', intersects => {
    if (!intersects && (started || entering)) {
      pause();
      replayReady = true;
      present('waiting');
      // Keep the final frame (and its transition suppression) until actual re-entry.
      if (!settled) state('replay-ready');
    }
  });
  return dispose;
}

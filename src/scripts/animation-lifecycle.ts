/** Run an explanation once; retain ambient clocks across visibility changes. */
type Timeline = { play: () => void; settle: () => void; duration: number; ambient?: boolean; activity?: (active: boolean) => void; dispose?: () => void };
type Scheduler = { later: (callback: () => void, delay: number) => void };
type Task = { callback: () => void; remaining: number; since: number; timer?: ReturnType<typeof setTimeout> };
const mounted = new WeakMap<HTMLElement, () => void>();

export function mountAnimation(root: HTMLElement, factory: (scheduler: Scheduler) => Timeline, options: { loop?: boolean } = {}): () => void {
  const existing = mounted.get(root);
  if (existing) return existing;
  const visual = root.querySelector<HTMLElement>('[data-animation-visual]');
  const fallback = visual && { html: visual.innerHTML, className: visual.className, style: visual.getAttribute('style'), phase: visual.getAttribute('data-phase'), motion: visual.getAttribute('data-motion') };
  const media = window.matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  const entrance = Boolean(root.closest?.('.service-story'));
  const tasks = new Set<Task>();
  const held = new Set<Animation>();
  const observers: IntersectionObserver[] = [];
  let timeline: Timeline | undefined;
  let started = false, running = false, settled = false, disposed = false;
  let visible = false, entered = false, parked = false, entering = false, failed = false;
  const present = (value: string) => {
    if (!entrance) return;
    root.dataset.animationEntrance = value;
    if (visual) visual.inert = value !== 'shown';
  };
  const activity = () => {
    const active = (running || (settled && Boolean(timeline?.ambient))) && visible && !document.hidden && !parked && !media.matches && !failed && !disposed;
    root.dataset.animationActive = String(active);
    root.classList.toggle('is-idle', !active);
    const animations = root.getAnimations?.({ subtree: true }) ?? [];
    for (const old of held) if (!animations.includes(old)) held.delete(old);
    for (const animation of animations) {
      if (active) {
        if (held.delete(animation) && animation.playState === 'paused') animation.play();
      } else if (animation.playState === 'running' || animation.pending) {
        animation.pause(); held.add(animation);
      }
    }
    root.querySelectorAll?.('svg').forEach(svg => {
      if (active) svg.unpauseAnimations?.(); else svg.pauseAnimations?.();
    });
    timeline?.activity?.(active);
  };
  const state = (value: string) => { root.dataset.animationState = value; activity(); };
  const cancel = () => { for (const task of tasks) clearTimeout(task.timer); tasks.clear(); };
  const finish = (error = false) => {
    if (settled && !error) { activity(); return; }
    settled = true; running = false; entering = false; failed ||= error;
    cancel(); present('shown'); state('settled');
    try {
      if (error || !timeline) {
        delete root.dataset.animationEnhanced;
        if (visual && fallback) {
          visual.innerHTML = fallback.html; visual.className = fallback.className;
          for (const [name, value] of [['data-phase', fallback.phase], ['data-motion', fallback.motion]]) { if (value === null) visual.removeAttribute(name!); else visual.setAttribute(name!, value!); }
          if (fallback.style === null) visual.removeAttribute('style'); else visual.setAttribute('style', fallback.style);
        }
      } else timeline.settle();
    } catch { failed = true; delete root.dataset.animationEnhanced; if (visual && fallback) visual.innerHTML = fallback.html; }
    activity();
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
    tasks.add(task); if (running) arm(task);
  };
  const pause = () => {
    if (running) {
      running = false;
      for (const task of tasks) {
        clearTimeout(task.timer);
        task.remaining = Math.max(0, task.remaining - (performance.now() - task.since));
      }
      state(settled ? 'settled' : 'paused');
    } else activity();
  };
  const startSequence = () => {
    entering = false; started = true; present('shown'); state('running');
    try {
      timeline!.play();
      if (!options.loop && timeline!.duration > 0) later(() => finish(), timeline!.duration);
    } catch { finish(true); }
  };
  const reconcile = () => {
    if (disposed || failed) return;
    if (media.matches) { finish(); activity(); return; }
    if (!visible || document.hidden || parked) { pause(); return; }
    if (settled) { activity(); return; }
    if ((!started && !entered) || running) return;
    running = true; state(entering ? 'entering' : 'running');
    for (const task of tasks) arm(task);
    if (!started && !entering) {
      if (entrance) { entering = true; present('entering'); state('entering'); later(startSequence, 600); }
      else startSequence();
    }
  };
  const pagehide = (event: PageTransitionEvent) => { if (!event.persisted) dispose(); else { parked = true; pause(); } };
  const pageshow = () => { parked = false; reconcile(); };
  const dispose = () => {
    if (disposed) return;
    disposed = true; running = false; cancel(); activity(); timeline?.dispose?.(); held.clear();
    observers.forEach(observer => observer.disconnect());
    document.removeEventListener('visibilitychange', reconcile); media.removeEventListener('change', reconcile);
    window.removeEventListener('pagehide', pagehide); window.removeEventListener('pageshow', pageshow);
    document.removeEventListener('astro:before-swap', dispose); mounted.delete(root);
  };
  mounted.set(root, dispose);
  root.dataset.animationEnhanced = 'true'; present('waiting'); state('waiting');
  try {
    timeline = factory({ later });
    if (!Number.isFinite(timeline.duration) || timeline.duration < 0) throw new Error('Invalid timeline duration');
  } catch { finish(true); return dispose; }
  if (!('IntersectionObserver' in window)) { finish(); return dispose; }
  document.addEventListener('visibilitychange', reconcile); media.addEventListener('change', reconcile);
  window.addEventListener('pagehide', pagehide); window.addEventListener('pageshow', pageshow);
  document.addEventListener('astro:before-swap', dispose);
  for (const margin of ['0px', '-96px 0px']) {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.target === root);
      if (!entry || disposed) return;
      if (margin === '0px') visible = entry.isIntersecting; else entered = entry.isIntersecting;
      reconcile();
    }, { rootMargin: margin, threshold: 0 });
    observers.push(observer); observer.observe(root);
  }
  reconcile(); return dispose;
}

/** Manual, local state. Viewport exit never rebuilds the DOM or resets progress. */
const mounted = new WeakMap<HTMLElement, () => void>();
type Phase = 'decision' | 'explanation' | 'final';

export function initializePhishingExperiences(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>('[data-phishing-experience]').forEach(root => {
    if (mounted.has(root)) return;
    const fallback = root.querySelector<HTMLElement>('[data-decision-fallback]');
    const progress = root.querySelector<HTMLElement>('[data-decision-progress]');
    const count = root.querySelector<HTMLElement>('[data-decision-count]');
    const segments = [...root.querySelectorAll<HTMLElement>('[data-decision-segment]')];
    const decisions = [...root.querySelectorAll<HTMLElement>('[data-decision-scenario]')];
    const explanations = [...root.querySelectorAll<HTMLElement>('[data-decision-explanation]')];
    const final = root.querySelector<HTMLElement>('[data-decision-final]');
    const finalHeading = final?.querySelector<HTMLElement>('[data-decision-heading]');
    const restart = root.querySelector<HTMLButtonElement>('[data-decision-restart]');
    const announcement = root.querySelector<HTMLElement>('[data-decision-announcement]');
    const steps = decisions.map((panel, index) => ({
      panel, heading: panel.querySelector<HTMLElement>('[data-decision-heading]'),
      options: [...panel.querySelectorAll<HTMLButtonElement>('[data-decision-option]')],
      feedback: explanations.filter(text => text.dataset.decisionIndex === String(index)).map(panel => ({
        panel, next: panel.querySelector<HTMLButtonElement>('[data-decision-next]'),
        copy: panel.querySelector<HTMLElement>('[data-decision-feedback]')
      }))
    }));
    if (!fallback || !progress || !count || !final || !finalHeading || !restart || !announcement || steps.length !== 4 || segments.length !== 4 || steps.some(step => !step.heading || step.options.length !== 3 || step.feedback.length !== 3 || step.feedback.some(view => !view.next || !view.copy) || step.options.some(option => !step.feedback.some(view => view.panel.dataset.decisionExplanation === option.dataset.decisionOption)))) return;

    let current = 0;
    let phase: Phase = 'decision';
    let selected: string | undefined;
    let active = steps[0].panel;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let transition: { previous: HTMLElement; incoming: HTMLElement; animations: Animation[] } | undefined;
    const listeners: { button: HTMLButtonElement; handler: () => void }[] = [];
    const listen = (button: HTMLButtonElement, handler: () => void) => {
      button.addEventListener('click', handler);
      listeners.push({ button, handler });
    };
    const conceal = (panel: HTMLElement) => {
      panel.hidden = true;
      panel.inert = true;
      panel.setAttribute('aria-hidden', 'true');
    };
    const reveal = (panel: HTMLElement) => {
      panel.hidden = false;
      panel.inert = false;
      panel.removeAttribute('aria-hidden');
    };
    const settle = () => {
      const pending = transition;
      transition = undefined;
      if (!pending) return;
      pending.animations.forEach(animation => animation.cancel());
      conceal(pending.previous);
      reveal(pending.incoming);
    };
    const updateProgress = () => {
      count.textContent = `${String(current + 1).padStart(2, '0')} / 04`;
      count.setAttribute('aria-label', phase === 'final' ? 'Four messages explored' : `Message ${current + 1} of 4`);
      segments.forEach((segment, index) => { segment.dataset.active = String(index <= current); });
      root.dataset.decisionPhase = phase;
      root.dataset.decisionIndex = String(current);
    };
    const replace = (incoming: HTMLElement, focus: HTMLElement) => {
      settle();
      const previous = active;
      active = incoming;
      reveal(incoming);
      // Give the new state a sensible target before retiring the old focused control.
      focus.focus({ preventScroll: true });
      previous.inert = true;
      previous.setAttribute('aria-hidden', 'true');
      if (motion.matches || !incoming.animate) {
        conceal(previous);
        return;
      }
      const timing = { duration: 380, easing: 'ease-out' };
      const animations = [
        previous.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-8px)' }], timing),
        incoming.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], timing)
      ];
      const pending = { previous, incoming, animations };
      transition = pending;
      void Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (transition === pending) settle();
      }).catch(() => { /* Interrupted transitions settle at the explicit user's current state. */ });
    };
    steps.forEach((step, index) => {
      step.options.forEach(option => listen(option, () => {
        if (phase !== 'decision' || current !== index) return;
        selected = option.dataset.decisionOption!;
        step.options.forEach(button => button.setAttribute('aria-pressed', String(button === option)));
        const view = step.feedback.find(view => view.panel.dataset.decisionExplanation === selected)!;
        phase = 'explanation';
        updateProgress();
        replace(view.panel, view.next!);
        announcement.textContent = view.copy!.textContent;
      }));
      step.feedback.forEach(view => listen(view.next!, () => {
        if (phase !== 'explanation' || current !== index || selected !== view.panel.dataset.decisionExplanation) return;
        selected = undefined;
        if (current === steps.length - 1) {
          phase = 'final';
          replace(final, finalHeading);
          announcement.textContent = 'Knowing when to pause matters. Having an IT team that can verify the context matters more. Your IT person is a team.';
        } else {
          current += 1;
          phase = 'decision';
          replace(steps[current].panel, steps[current].heading!);
          announcement.textContent = `Message ${current + 1} of 4. Choose what you would do next.`;
        }
        updateProgress();
      }));
    });
    listen(restart, () => {
      if (phase !== 'final') return;
      current = 0;
      phase = 'decision';
      selected = undefined;
      steps.forEach(step => step.options.forEach(button => button.setAttribute('aria-pressed', 'false')));
      replace(steps[0].panel, steps[0].heading!);
      updateProgress();
      announcement.textContent = 'Message 1 of 4. Choose what you would do next.';
    });
    const reduceMotion = () => { if (motion.matches) settle(); };
    motion.addEventListener('change', reduceMotion);
    const dispose = () => {
      settle();
      listeners.forEach(({ button, handler }) => button.removeEventListener('click', handler));
      motion.removeEventListener('change', reduceMotion);
      document.removeEventListener('astro:before-swap', dispose);
      mounted.delete(root);
    };
    mounted.set(root, dispose);
    document.addEventListener('astro:before-swap', dispose, { once: true });
    decisions.concat(explanations, [final]).forEach(conceal);
    reveal(active);
    conceal(fallback);
    progress.hidden = false;
    updateProgress();
    root.dataset.decisionReady = 'true';
  });
}

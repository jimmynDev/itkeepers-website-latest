/** Native SVG/CSS clocks, with selection independent of motion state. */
export function createCloudHeroTimeline(root: HTMLElement) {
  const visual = root.querySelector<HTMLElement>('[data-animation-visual]')!;
  const network = root.querySelector<SVGSVGElement>('.network')!;
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('.capability'));
  const select = (event: Event) => {
    const id = (event.currentTarget as HTMLButtonElement).dataset.id;
    if (!id) return;
    visual.dataset.active = id;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.id === id)));
  };
  buttons.forEach(button => button.addEventListener('click', select));
  network.pauseAnimations(); network.setCurrentTime(0);
  let started = false;
  return {
    duration: 0, ambient: true,
    play() {}, settle() {},
    activity(active: boolean) {
      visual.dataset.motion = active ? 'running' : 'paused';
      if (active && !started) {
        started = true;
        network.querySelectorAll<SVGAnimationElement>('[data-signal-delay]').forEach(animation => {
          animation.beginElementAt(Number(animation.dataset.signalDelay));
        });
      }
      if (active) network.unpauseAnimations(); else network.pauseAnimations();
    },
    dispose() { network.pauseAnimations(); buttons.forEach(button => button.removeEventListener('click', select)); },
  };
}

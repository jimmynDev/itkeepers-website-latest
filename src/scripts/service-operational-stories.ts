/** Adapt the approved prototype phases to the shared viewport lifecycle. */
type Scheduler = { later: (callback: () => void, delay: number) => void };
export function createServiceStory(root: HTMLElement, _scheduler: Scheduler, kind: 'cloud' | 'security') {
  const visual = root.querySelector<HTMLElement>('[data-animation-visual]')!;
  const svgs = Array.from(visual.querySelectorAll<SVGSVGElement>('svg'));
  let active = false;
  const motion = () => {
    visual.dataset.motion = active ? 'running' : 'paused';
    // CSS transitions (unlike CSS animations) do not honor animation-play-state.
    // Pause their existing timelines too, without touching the visual entrance.
    for (const animation of visual.getAnimations({ subtree: true })) {
      if (animation.effect instanceof KeyframeEffect && animation.effect.target === visual) continue;
      if (!active) animation.pause();
      else if (animation.playState === 'paused') animation.play();
    }
    for (const svg of svgs) {
      // SMIL data pulses are ambient only; CSS owns the main story.
      if (active && visual.dataset.phase === 'settled') svg.unpauseAnimations();
      else svg.pauseAnimations();
    }
  };
  svgs.forEach(svg => { svg.pauseAnimations(); svg.setCurrentTime(0); });
  visual.dataset.phase = 'idle';
  visual.dataset.motion = 'paused';
  return {
    ambient: true,
    activity(value: boolean) { active = value; motion(); },
    play() { visual.dataset.phase = 'play'; motion(); },
    settle() { visual.dataset.phase = 'settled'; motion(); },
    duration: kind === 'cloud' ? 4400 : 5000,
  };
}

/** Canvas drawing from the supplied brand-blue concept; lifecycle owns playback. */
export function createRadarTimeline(root: HTMLElement) {
  const radar = root.querySelector<HTMLElement>('.itk-radar')!;
  const canvas = radar.querySelector<HTMLCanvasElement>('canvas')!;
  const ctx = canvas.getContext('2d');
  const status = radar.querySelector<HTMLElement>('[data-status]')!;
  if (!ctx) throw new Error('Canvas unavailable');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  const BLUE = '66,186,235', CORAL = '255,91,119';
  const particles = Array.from({ length: 52 }, (_, i) => ({
    x: (i * 83.33) % 500, y: (i * 137.17 + 71) % 500,
    size: (i % 5) * .28 + .45, alpha: .18 + (i % 7) * .045,
  }));
  let active = false, raf = 0, elapsed = 0, last = 0, phase = -1, staticFrame = true;
  function draw(time: number, staticFrame = false) {
    ctx!.setTransform(canvas.width / 500, 0, 0, canvas.height / 500, 0, 0);
    ctx!.clearRect(0, 0, 500, 500);
    for (const p of particles) {
      ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${BLUE},${p.alpha})`; ctx!.fill();
    }
    const angle = staticFrame ? -1 : (time * .00087) % (Math.PI * 2);
    ctx!.beginPath(); ctx!.moveTo(250, 250); ctx!.arc(250, 250, 220, angle - .43, angle); ctx!.closePath();
    ctx!.fillStyle = `rgba(${BLUE},.038)`; ctx!.fill();
    ctx!.beginPath(); ctx!.moveTo(250, 250);
    ctx!.lineTo(250 + 220 * Math.cos(angle), 250 + 220 * Math.sin(angle));
    ctx!.lineWidth = 1.6; ctx!.strokeStyle = `rgba(${BLUE},.72)`;
    ctx!.shadowBlur = 8; ctx!.shadowColor = `rgb(${BLUE})`; ctx!.stroke(); ctx!.shadowBlur = 0;
    // The supplied 8.2s approach / interception / containment sequence.
    const cycle = staticFrame ? 6 : (time / 1000) % 8.2;
    const nextPhase = cycle < 3.7 ? 0 : cycle < 5.6 ? 1 : 2;
    if (phase !== nextPhase) {
      phase = nextPhase;
      status.textContent = ['Endpoint watched', 'Threat blocked', 'Threat contained'][phase];
      radar.classList.toggle('is-threat', phase === 1);
      radar.dataset.radarPhase = ['approach', 'intercept', 'contained'][phase];
    }
    if (cycle < 5.6) {
      const progress = Math.min(cycle / 3.7, 1);
      const x = 40 + 140 * progress, y = 40 + 140 * progress;
      const alpha = cycle > 4.7 ? Math.max(0, (5.6 - cycle) / .9) : 1;
      ctx!.beginPath(); ctx!.arc(x, y, 4, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${CORAL},${alpha})`;
      ctx!.shadowBlur = 10; ctx!.shadowColor = `rgb(${CORAL})`; ctx!.fill(); ctx!.shadowBlur = 0;
      if (cycle > 3.7) {
        ctx!.beginPath(); ctx!.arc(x, y, Math.max(8, 25 - (cycle - 3.7) * 15), 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${CORAL},${alpha})`; ctx!.lineWidth = 1.5; ctx!.stroke();
      }
    }
  }
  // Measure on resize only, never on the drawing hot path.
  function resize() {
    const width = radar.getBoundingClientRect().width;
    if (!width) return;
    const pixels = Math.max(1, Math.round(width * Math.min(window.devicePixelRatio || 1, 2)));
    if (canvas.width !== pixels || canvas.height !== pixels) canvas.width = canvas.height = pixels;
    draw(elapsed, staticFrame);
  }
  function frame(now: number) {
    raf = 0;
    if (!active) return;
    elapsed += now - last; last = now;
    draw(elapsed); raf = requestAnimationFrame(frame);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(radar); window.addEventListener('resize', resize);
  resize(); draw(0, true);
  return {
    duration: 0, ambient: true,
    play() {},
    settle() { if (!active) { staticFrame = true; draw(elapsed, true); } },
    activity(value: boolean) {
      if (!value && reduced.matches) { staticFrame = true; draw(elapsed, true); }
      if (value === active) return;
      active = value;
      if (active) { staticFrame = false; last = performance.now(); draw(elapsed); raf = requestAnimationFrame(frame); }
      else { cancelAnimationFrame(raf); raf = 0; }
    },
    dispose() { active = false; cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener('resize', resize); },
  };
}

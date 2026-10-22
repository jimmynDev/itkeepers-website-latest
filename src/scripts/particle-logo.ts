/** Living Particle K: original reference motion, colors and fixed homes; no reveal. */
let referenceMask: {data: Uint8ClampedArray; keepMask: Uint8Array} | undefined;
function getReferenceMask(logo: HTMLImageElement) {
  if (referenceMask) return referenceMask;
        const srcW = 740, srcH = 830;
        const off = document.createElement('canvas');
        off.width = srcW; off.height = srcH;
        const octx = off.getContext('2d', { willReadFrequently: true });
        octx.clearRect(0,0,srcW,srcH);
        octx.imageSmoothingEnabled = true;
        octx.drawImage(logo, 0, 0, srcW, srcH);
        const { data } = octx.getImageData(0,0,srcW,srcH);
        const thresholdMask = new Uint8Array(srcW * srcH);

        for (let y = 0; y < srcH; y++) {
          for (let x = 0; x < srcW; x++) {
            const ix = (y * srcW + x) * 4;
            const r = data[ix], g = data[ix+1], b = data[ix+2], a = data[ix+3];
            const brightness = 0.2126*r + 0.7152*g + 0.0722*b;
            if (a >= 120 && brightness >= 110) thresholdMask[y * srcW + x] = 1;
          }
        }

        // Keep only the largest connected bright region so stray detached bits are removed.
        const visited = new Uint8Array(srcW * srcH);
        let largestComponent = null;
        let largestSize = 0;
        const neighbors = [-1, 0, 1];

        for (let y = 0; y < srcH; y++) {
          for (let x = 0; x < srcW; x++) {
            const start = y * srcW + x;
            if (!thresholdMask[start] || visited[start]) continue;
            const stack = [start];
            const component = [];
            visited[start] = 1;

            while (stack.length) {
              const idx = stack.pop();
              component.push(idx);
              const cx = idx % srcW;
              const cy = (idx / srcW) | 0;
              for (const oy of neighbors) {
                for (const ox of neighbors) {
                  if (ox === 0 && oy === 0) continue;
                  const nx = cx + ox;
                  const ny = cy + oy;
                  if (nx < 0 || ny < 0 || nx >= srcW || ny >= srcH) continue;
                  const nidx = ny * srcW + nx;
                  if (!thresholdMask[nidx] || visited[nidx]) continue;
                  visited[nidx] = 1;
                  stack.push(nidx);
                }
              }
            }

            if (component.length > largestSize) {
              largestSize = component.length;
              largestComponent = component;
            }
          }
        }

        const keepMask = new Uint8Array(srcW * srcH);
        if (largestComponent) {
          for (const idx of largestComponent) keepMask[idx] = 1;
        }


  if (!largestComponent?.length) throw new Error('Empty particle logo mask');
  referenceMask = { data, keepMask };
  return referenceMask;
}

export function createParticleLogo(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('[data-animation-visual]')!;
  const canvas = stage.querySelector<HTMLCanvasElement>('canvas')!;
  const fallbackTemplate = stage.querySelector('.particle-fallback')?.cloneNode(true);
  const ctx = canvas.getContext('2d', {alpha:true});
  if (!ctx) throw new Error('Canvas unavailable; retain the static logo');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const compact = matchMedia('(max-width: 639px)');
      const TAU = 2 * Math.PI;
      const rand = (a,b) => a + Math.random() * (b-a);
      const clamp = (n,a,b) => Math.max(a, Math.min(b,n));

      let width=1, height=1, dpr=1, particles=[], stars=[];
      let frame=0, last=0, visible=false, playing=false, disposed=false, loading=false;
      const pointer={x:-1e4,y:-1e4,active:false};
      const logo = new Image();
      let logoReady = false;

      function buildLogoMask() {
        const srcW = 740, srcH = 830;
        const {data, keepMask} = getReferenceMask(logo);

        const points = [];
        const isMobile = compact.matches;
        const spacing = isMobile ? 8 : 6;
        const scale = Math.min(width * 0.62 / srcW, height * 0.62 / srcH, 1.15);
        const cx = width / 2;
        const cy = height * 0.49;

        for (let y = 0; y < srcH; y += spacing) {
          for (let x = 0; x < srcW; x += spacing) {
            const pixelIndex = (y|0) * srcW + (x|0);
            if (!keepMask[pixelIndex] || Math.random() > 0.98) continue;
            const ix = pixelIndex * 4;
            const r = data[ix], g = data[ix+1], b = data[ix+2];
            const brightness = 0.2126*r + 0.7152*g + 0.0722*b;
            points.push({
              homeX: cx + (x - srcW/2) * scale,
              homeY: cy + (y - srcH/2) * scale,
              r, g, b,
              alpha: clamp((brightness / 255) * rand(0.72, 1.0), 0.55, 1.0)
            });
          }
        }
        return points;
      }

      function initParticles() {
        const mobile = compact.matches;
        const points = buildLogoMask();
        particles = points.map(pt => ({
          homeX: pt.homeX,
          homeY: pt.homeY,
          x: pt.homeX,
          y: pt.homeY,
          vx: 0,
          vy: 0,
          phase: rand(0, TAU),
          flow: rand(mobile ? 1.6 : 1.8, mobile ? 3.4 : 4.2),
          orbit: rand(0.65, 1.35),
          swirl: rand(0.5, 1.4),
          radius: rand(mobile ? 0.95 : 0.9, mobile ? 1.8 : 2.0),
          opacity: pt.alpha,
          color: `rgb(${pt.r},${pt.g},${pt.b})`
        }));

        stage.dataset.particleCount = String(particles.length);
        const count = mobile ? 55 : 125;
        stars = Array.from({length:count},()=>({
          x:rand(0,width), y:rand(0,height), r:rand(.35,1.1),
          phase:rand(0,TAU), alpha:rand(.05,.3)
        }));
      }

      function draw(time=0, staticMode=false) {
        ctx.clearRect(0,0,width,height);
        for (const s of stars) {
          const a = staticMode ? s.alpha : s.alpha * (.75 + .25 * Math.sin(time * .0007 + s.phase));
          ctx.fillStyle = 'rgb(98,166,218)'; ctx.globalAlpha = a;
          ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,TAU); ctx.fill();
        }
        ctx.globalCompositeOperation = 'screen';
        for (const p of particles) {
          ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(staticMode ? p.homeX : p.x, staticMode ? p.homeY : p.y, p.radius, 0, TAU);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      }

      function animate(time) {
        frame = 0;
        if (!visible || disposed || document.hidden || reduced.matches || forced.matches || !logoReady) return;
        const step = Math.min((time - (last || time)) / 16.667, 2);
        last = time;
        const mobile = compact.matches;
        const reach = mobile ? 92 : 132;
        const maxDist = mobile ? 22 : 30;
        const damp = Math.pow(0.87, step);
        const reachSquared = reach * reach;
        const maxDistSquared = maxDist * maxDist;

        for (const p of particles) {
          // More noticeable but still restrained slow-motion flow while idle.
          const idleX = (
            Math.sin(time * 0.00042 * p.orbit + p.phase) * p.flow * 0.95 +
            Math.sin(time * 0.00021 + p.phase * 1.9) * p.flow * 0.55
          );
          const idleY = (
            Math.cos(time * 0.00037 * p.swirl + p.phase * 1.13) * p.flow * 1.05 +
            Math.sin(time * 0.00019 + p.phase * 2.4) * p.flow * 0.45
          );

          const targetX = p.homeX + idleX;
          const targetY = p.homeY + idleY;

          p.vx += (targetX - p.x) * 0.045 * step;
          p.vy += (targetY - p.y) * 0.045 * step;

          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const distSq = dx*dx + dy*dy;
            if (distSq < reachSquared && distSq > 0.1) {
              const dist = Math.sqrt(distSq);
              const strength = 1 - dist / reach;
              const force = strength * 3.1 * step;
              p.vx += (dx / dist * force - dy / dist * force * 0.28);
              p.vy += (dy / dist * force + dx / dist * force * 0.28);
            }
          }

          p.vx *= damp;
          p.vy *= damp;
          p.x += p.vx * step;
          p.y += p.vy * step;

          const ox = p.x - p.homeX;
          const oy = p.y - p.homeY;
          const distanceSquared = ox * ox + oy * oy;
          if (distanceSquared > maxDistSquared) {
            const dist = Math.sqrt(distanceSquared);
            p.x = p.homeX + ox / dist * maxDist;
            p.y = p.homeY + oy / dist * maxDist;
            p.vx *= 0.72;
            p.vy *= 0.72;
          }
        }

        draw(time);
        frame = requestAnimationFrame(animate);
      }


  function stop() { if(frame) cancelAnimationFrame(frame); frame=0; last=0; pointer.active=false; }
  function start() {
    if(frame || !playing || disposed || !visible || document.hidden || reduced.matches || forced.matches || !logoReady) return;
    frame=requestAnimationFrame(animate);
  }
  function fallback() {
    stop();
    ctx!.clearRect(0,0,width,height);
    if(fallbackTemplate && !stage.querySelector('.particle-fallback')) stage.prepend(fallbackTemplate.cloneNode(true));
    delete stage.dataset.particleReady;
  }
  function presentCanvas() {
    // Commit a particle frame before removing the loading surface. A readiness
    // flag must never swap a solid image into the live animation layer.
    draw();
    stage.querySelector('.particle-fallback')?.remove();
    stage.dataset.particleReady='true';
  }
  function resize() {
    const rect=stage.getBoundingClientRect();
    const nextDpr=Math.min(devicePixelRatio || 1,1.75);
    if(Math.abs(rect.width-width)<.5 && Math.abs(rect.height-height)<.5 && nextDpr===dpr && particles.length) return;
    width=Math.max(1,rect.width); height=Math.max(1,rect.height); dpr=nextDpr;
    canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr);
    ctx!.setTransform(dpr,0,0,dpr,0,0);
    initParticles(); draw(0,reduced.matches);
  }
  function prepare() {
    if(disposed || reduced.matches || forced.matches) { fallback(); return; }
    if(logoReady) { resize(); presentCanvas(); start(); return; }
    if(loading) return;
    loading=true;
    logo.onload=()=>{
      if(disposed) return;
      try {
        getReferenceMask(logo); logoReady=true;
        if(!visible || document.hidden || reduced.matches || forced.matches) return;
        resize(); presentCanvas(); start();
      } catch { fallback(); }
    };
    logo.onerror=fallback;
    logo.src='/assets/itkeepers-particle-k.png';
  }
  const move=(event: PointerEvent)=>{
    if(!visible || !fine.matches || event.pointerType==='touch') return;
    const rect=stage.getBoundingClientRect();
    pointer.x=event.clientX-rect.left; pointer.y=event.clientY-rect.top; pointer.active=true;
  };
  const leave=()=>{pointer.active=false;};
  const preference=()=>{if(reduced.matches || forced.matches) fallback(); else if(visible && playing) prepare();};
  const breakpoint=()=>{if(visible && logoReady) {initParticles();draw();}};
  const observer=typeof ResizeObserver==='undefined' ? undefined : new ResizeObserver(()=>{
    if(visible && logoReady && !disposed) resize();
  });
  observer?.observe(stage);
  stage.addEventListener('pointermove',move,{passive:true});
  stage.addEventListener('pointerleave',leave,{passive:true});
  stage.addEventListener('pointercancel',leave,{passive:true});
  fine.addEventListener('change',leave); compact.addEventListener('change',breakpoint);
  reduced.addEventListener('change',preference); forced.addEventListener('change',preference);
  return {
    duration:0, ambient:true,
    play() {playing=true;prepare();},
    settle() {if(reduced.matches || forced.matches || !logoReady) fallback(); else draw(0,true);},
    activity(value: boolean) {visible=value;if(!value) stop();else if(playing) prepare();},
    dispose() {
      if(disposed) return;
      disposed=true;visible=false;stop();observer?.disconnect();
      logo.onload=null;logo.onerror=null;
      stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',leave);stage.removeEventListener('pointercancel',leave);
      fine.removeEventListener('change',leave);compact.removeEventListener('change',breakpoint);
      reduced.removeEventListener('change',preference);forced.removeEventListener('change',preference);
      particles=[];stars=[];
    },
  };
}


export function createNeuralSphere(root) {
  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const day = () => document.documentElement.dataset.heroTheme === "day";
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ---------- tweakables ---------- */
  const NODES      = 72;     // neurons on the sphere
  const LINKS      = 3;      // connections per neuron (nearest neighbours)
  const SPIN       = 0.22;   // rotation speed
  const FIRE_EVERY = 0.45;   // seconds between new signal chains
  const HOP_TIME   = 0.7;    // seconds per hop
  const HOPS       = 5;      // how far a chain travels
  /* -------------------------------- */

  // Violet orchestration with a minority of ITKeepers cyan support nodes.
  const hueFor = y => 247 + y * 8;

  // Fibonacci sphere
  const pts = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODES; i++) {
    const y = 1 - (i / (NODES - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i;
    pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r,
               hue: i % 6 === 0 ? 197 : hueFor(y), glow: 0, ph: Math.random() * 6.28, adj: [], sx: 0, sy: 0, sz: 0, sc: 1 });
  }
  // nearest-neighbour edges
  const edges = [], seen = new Set();
  pts.forEach((p, i) => {
    pts.map((q, j) => ({ j, d: (p.x-q.x)**2 + (p.y-q.y)**2 + (p.z-q.z)**2 }))
       .filter(o => o.j !== i).sort((a, b) => a.d - b.d).slice(0, LINKS)
       .forEach(({ j }) => {
         const key = i < j ? i + "-" + j : j + "-" + i;
         if (seen.has(key)) return; seen.add(key);
         const e = { a: i, b: j, glow: 0 };
         edges.push(e); pts[i].adj.push({ n: j, e }); pts[j].adj.push({ n: i, e });
       });
  });

  let w, h, cx, cy, R, t = 0, last = performance.now(), nextFire = 0;
  let signals = [], ripples = [];

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height; cx = w / 2; cy = h / 2; R = Math.min(w, h) * 0.34;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(0);
  }

  const smooth = x => x * x * (3 - 2 * x);   // smoothstep — soft start & landing

  function project() {
    const ay = t * SPIN, ax = 0.35 + Math.sin(t * 0.15) * 0.12;
    const cyA = Math.cos(ay), syA = Math.sin(ay), cxA = Math.cos(ax), sxA = Math.sin(ax);
    const breathe = 1 + Math.sin(t * 0.9) * 0.025;
    pts.forEach(p => {
      let x = p.x * cyA + p.z * syA, z = -p.x * syA + p.z * cyA, y = p.y;
      const y2 = y * cxA - z * sxA; z = y * sxA + z * cxA; y = y2;
      const persp = 3 / (3 + z);
      p.sx = cx + x * R * persp * breathe;
      p.sy = cy + y * R * persp * breathe;
      p.sz = z;                      // -1 front … +1 back
      p.sc = persp;
      p.depth = (1 - z) / 2;         // 1 = front, 0 = back
    });
  }

  function fire(from, prev, hops, hue) {
    const opts = pts[from].adj.filter(a => a.n !== prev);
    if (!opts.length || hops <= 0) return;
    const pick = opts[Math.floor(Math.random() * opts.length)];
    signals.push({ from, to: pick.n, e: pick.e, p: 0, hops, hue });
  }

  function arrive(i, hue) {
    const p = pts[i];
    p.glow = 1;
    ripples.push({ n: i, r: 0, a: 0.5, hue });
  }

  function draw(dt) {
    t += dt;
    project();

    if (dt > 0 && t >= nextFire) {
      nextFire = t + FIRE_EVERY * (0.7 + Math.random() * 0.6);
      const s = Math.floor(Math.random() * NODES);
      arrive(s, pts[s].hue);
      fire(s, -1, HOPS, pts[s].hue);
    }

    ctx.clearRect(0, 0, w, h);

    // soft core glow
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.5);
    core.addColorStop(0, `hsla(${247 + Math.sin(t * 0.2) * 8}, 60%, 55%, ${0.065 + Math.sin(t * 0.9) * 0.015})`);
    core.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = core; ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = day() ? "source-over" : "lighter";
    ctx.lineCap = "round";

    // edges
    edges.forEach(e => {
      e.glow *= Math.pow(0.25, dt);
      const a = pts[e.a], b = pts[e.b], d = (a.depth + b.depth) / 2;
      ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 60%, ${day() ? 35 : 70}%, ${(day() ? 0.18 : 0.03) + d * 0.11 + e.glow * 0.45})`;
      ctx.lineWidth = 0.5 + d * 0.6 + e.glow * 1.4;
      ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
    });

    // signals — soft glowing beads with gentle trails
    // Keep newly spawned hops instead of discarding them when filtering old ones.
    const activeSignals = signals;
    signals = [];
    activeSignals.forEach(s => {
      s.p += dt / HOP_TIME;
      const a = pts[s.from], b = pts[s.to], k = smooth(Math.min(s.p, 1));
      s.e.glow = Math.max(s.e.glow, 0.7 * Math.sin(Math.PI * Math.min(s.p, 1)));
      const d = (a.depth + b.depth) / 2;
      for (let i = 0; i < 10; i++) {
        const kk = Math.max(0, k - i * 0.025), f = 1 - i / 10;
        const x = a.sx + (b.sx - a.sx) * kk, y = a.sy + (b.sy - a.sy) * kk;
        ctx.fillStyle = `hsla(${s.hue}, 70%, ${day() ? 35 : 82}%, ${f * (0.25 + d * 0.45)})`;
        ctx.beginPath(); ctx.arc(x, y, (0.6 + f * 2) * (0.7 + d * 0.5), 0, 6.283); ctx.fill();
      }
      const hx = a.sx + (b.sx - a.sx) * k, hy = a.sy + (b.sy - a.sy) * k;
      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 12);
      g.addColorStop(0, `hsla(${s.hue}, 80%, ${day() ? 35 : 85}%, ${0.25 + d * 0.35})`); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, 12, 0, 6.283); ctx.fill();

      if (s.p >= 1) {
        arrive(s.to, s.hue);
        fire(s.to, s.from, s.hops - 1, s.hue);
        if (Math.random() < 0.2) fire(s.to, s.from, s.hops - 2, s.hue);
        return;
      }
      signals.push(s);
    });

    // ripples follow their neuron as the sphere turns
    ripples = ripples.filter(r => {
      r.r += dt * 30; r.a *= Math.pow(0.12, dt);
      const p = pts[r.n];
      ctx.strokeStyle = `hsla(${r.hue}, 70%, ${day() ? 35 : 80}%, ${r.a * (0.3 + p.depth * 0.7)})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p.sx, p.sy, 3 + r.r * p.sc, 0, 6.283); ctx.stroke();
      return r.a > 0.02;
    });

    // neurons, back to front
    [...pts].sort((a, b) => b.sz - a.sz).forEach(p => {
      p.glow *= Math.pow(0.2, dt);
      const breathe = 0.5 + 0.5 * Math.sin(t * 1.2 + p.ph);
      const d = p.depth, size = (1.4 + d * 2) * p.sc;
      const haloR = (10 + p.glow * 12) * p.sc;
      const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, haloR);
      g.addColorStop(0, `hsla(${p.hue}, 70%, ${day() ? 35 : 72}%, ${(0.08 + breathe * 0.06) * (0.4 + d) + p.glow * 0.45})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.sx, p.sy, haloR, 0, 6.283); ctx.fill();
      ctx.fillStyle = `hsla(${p.hue}, 65%, ${(day() ? 32 : 72) + p.glow * 22}%, ${0.25 + d * 0.65})`;
      ctx.beginPath(); ctx.arc(p.sx, p.sy, size + p.glow * 1.6, 0, 6.283); ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";

  }

  let raf = null;
  function frame(now) {
    raf = null;
    if (root.dataset.animationState !== 'running') return;
    const dt = Math.min((now-last)/1000,.05); last=now;
    draw(dt);
    raf=requestAnimationFrame(frame);
  }
  function stop() { if(raf!==null) cancelAnimationFrame(raf); raf=null; }
  function start() { if(raf!==null || root.dataset.animationState!=='running') return; last=performance.now(); raf=requestAnimationFrame(frame); }
  const stateObserver = new MutationObserver(() => root.dataset.animationState==='running' ? start() : stop());
  stateObserver.observe(root,{attributes:true,attributeFilter:['data-animation-state']});
  const themeObserver = new MutationObserver(() => draw(0));
  themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-hero-theme']});
  const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(canvas);
  resize();
  canvas.parentElement.dataset.neuralReady='true';
  return {
    play:start,
    settle() { stop(); signals=[]; ripples=[]; t=7; pts.forEach((p,i)=>p.glow=i%11===0?.5:0); edges.forEach(e=>e.glow=.12); draw(0); },
    duration:12000,
    dispose() { stop();stateObserver.disconnect();themeObserver.disconnect();sizeObserver.disconnect(); }
  };
}

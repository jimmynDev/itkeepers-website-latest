
export function createIsometricNetwork(root) {
  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const day = () => document.documentElement.dataset.heroTheme === "day";
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ---------- tweakables ---------- */
  const SEND_EVERY = 0.55;   // seconds between packets (lower = busier)
  const PKT_SPEED  = 2.4;    // grid tiles per second
  const BOB        = 2.5;    // how much the blocks float (px)
  const HUE_IN     = 189;    // infrastructure teal #36B8D0 – into the hub
  const HUE_OUT    = 228;    // restrained indigo #5C74D8 – out of the hub
  /* -------------------------------- */

  const N = 7, HUB = { x: 3, y: 3 };
  const nodes = [
    { x: 3, y: 3, h: 46, s: 0.42, hub: true },
    { x: 0, y: 0, h: 22, s: 0.32 }, { x: 3, y: 0, h: 30, s: 0.32 },
    { x: 6, y: 1, h: 18, s: 0.32 }, { x: 1, y: 2, h: 26, s: 0.32 },
    { x: 5, y: 3, h: 24, s: 0.32 }, { x: 0, y: 5, h: 30, s: 0.32 },
    { x: 3, y: 6, h: 20, s: 0.32 }, { x: 6, y: 5, h: 28, s: 0.32 },
    { x: 2, y: 4, h: 16, s: 0.32 },
  ].map(n => ({ ...n, glow: 0, hue: HUE_IN, ph: Math.random() * 6.28,
                leds: Array.from({ length: 4 }, () => ({ ph: Math.random() * 6.28, f: .5 + Math.random() * 1.2 })) }));

  // L-shaped route from each node to the hub (x first, then y)
  const routes = nodes.slice(1).map(n => {
    const pts = [{ x: n.x, y: n.y }, { x: HUB.x, y: n.y }, { x: HUB.x, y: HUB.y }]
      .filter((p, i, a) => i === 0 || p.x !== a[i - 1].x || p.y !== a[i - 1].y);
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.abs(pts[i].x - pts[i - 1].x) + Math.abs(pts[i].y - pts[i - 1].y));
    return { node: n, pts, cum, len: cum[cum.length - 1], glow: 0, hue: HUE_IN };
  });

  let w, h, u, tw, th, ox, oy, t = 0, last = performance.now(), nextSend = 0.3;
  let packets = [], ripples = [];

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height; u = Math.min(w, h) / 400;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tw = Math.min(w, h) * 0.066; th = tw * 0.5;
    ox = w / 2; oy = h * 0.58 - (N - 1) * th;
    draw(0);
  }

  const iso = (x, y, z = 0) => ({ x: ox + (x - y) * tw, y: oy + (x + y) * th - z * u });
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  function posOn(r, d) {
    d = Math.max(0, Math.min(r.len, d));
    let i = 1; while (i < r.cum.length - 1 && r.cum[i] < d) i++;
    const A = r.pts[i - 1], B = r.pts[i], k = (d - r.cum[i - 1]) / ((r.cum[i] - r.cum[i - 1]) || 1);
    return { x: A.x + (B.x - A.x) * k, y: A.y + (B.y - A.y) * k };
  }

  function send() {
    const r = routes[Math.floor(Math.random() * routes.length)];
    const inbound = Math.random() < 0.55;
    packets.push({ r, inbound, p: 0, dur: r.len / PKT_SPEED, hue: inbound ? HUE_IN : HUE_OUT });
    const src = inbound ? r.node : nodes[0];
    src.glow = Math.max(src.glow, 0.5); src.hue = inbound ? HUE_IN : HUE_OUT;
  }

  function hit(n, hue) {
    n.glow = 1; n.hue = hue;
    ripples.push({ x: n.x, y: n.y, s: n.s, r: 0, a: 0.55, hue });
  }

  function poly(pts) { ctx.beginPath(); pts.forEach((p, i) => ctx[i ? "lineTo" : "moveTo"](p.x, p.y)); ctx.closePath(); }

  function drawBlock(n) {
    const s = n.s, H = n.h + Math.sin(t * 0.9 + n.ph) * BOB + n.glow * 3;
    const A = iso(n.x - s, n.y - s, H), B = iso(n.x + s, n.y - s, H),
          C = iso(n.x + s, n.y + s, H), D = iso(n.x - s, n.y + s, H);
    const B0 = iso(n.x + s, n.y - s), C0 = iso(n.x + s, n.y + s), D0 = iso(n.x - s, n.y + s);
    const hue = n.hue, g = n.glow;

    // soft shadow / glow on floor
    const base = iso(n.x, n.y);
    const fg = ctx.createRadialGradient(base.x, base.y, 0, base.x, base.y, tw * 1.6);
    fg.addColorStop(0, `hsla(${hue}, 70%, 60%, ${0.06 + g * 0.22})`); fg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(base.x, base.y, tw * 1.6, th * 1.6, 0, 0, 6.283); ctx.fill();

    // left face (y+)
    poly([D0, C0, C, D]); ctx.fillStyle = `hsl(${hue}, 35%, ${(day() ? 55 : 13) + g * 6}%)`; ctx.fill();
    // right face (x+)
    poly([C0, B0, B, C]); ctx.fillStyle = `hsl(${hue}, 35%, ${(day() ? 42 : 9) + g * 5}%)`; ctx.fill();
    // top
    poly([A, B, C, D]);
    ctx.fillStyle = `hsl(${hue}, 45%, ${(day() ? 75 : 20) + g * (day() ? 10 : 22)}%)`; ctx.fill();
    ctx.strokeStyle = `hsla(${hue}, 70%, 75%, ${0.35 + g * 0.5})`; ctx.lineWidth = 1 * u; ctx.stroke();

    // edges
    ctx.strokeStyle = `hsla(${hue}, 60%, 70%, ${0.18 + g * 0.3})`;
    ctx.beginPath(); ctx.moveTo(C0.x, C0.y); ctx.lineTo(C.x, C.y);
    ctx.moveTo(D0.x, D0.y); ctx.lineTo(C0.x, C0.y); ctx.lineTo(B0.x, B0.y); ctx.stroke();

    // rack LEDs on the left face
    const rows = Math.max(2, Math.floor(n.h / 10));
    for (let i = 0; i < rows; i++) {
      const z = (i + 0.6) * H / (rows + 0.4);
      const L = n.leds[i % 4], on = Math.max(0, Math.sin(t * L.f * 1.8 + L.ph)) * 0.6 + g * 0.5;
      const p1 = iso(n.x - s * 0.6, n.y + s, z), p2 = iso(n.x + s * 0.1, n.y + s, z);
      ctx.strokeStyle = `hsla(${hue}, 50%, 60%, 0.18)`; ctx.lineWidth = 1 * u;
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      const d = iso(n.x + s * 0.5, n.y + s, z);
      ctx.fillStyle = `hsla(${hue}, 85%, ${55 + on * 30}%, ${0.3 + Math.min(on, 1) * 0.7})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, 1.4 * u, 0, 6.283); ctx.fill();
    }

    // hub beacon
    if (n.hub) {
      const top = iso(n.x, n.y, H), beam = 34 * u * (0.8 + 0.2 * Math.sin(t * 1.4)) + g * 14 * u;
      const bg = ctx.createLinearGradient(top.x, top.y, top.x, top.y - beam);
      bg.addColorStop(0, `hsla(${hue}, 80%, 75%, ${0.35 + g * 0.4})`); bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = day() ? "source-over" : "lighter";
      ctx.fillStyle = bg; ctx.fillRect(top.x - 2 * u, top.y - beam, 4 * u, beam);
      const orb = ctx.createRadialGradient(top.x, top.y, 0, top.x, top.y, 14 * u);
      orb.addColorStop(0, `hsla(${hue}, 80%, 80%, ${0.3 + g * 0.4})`); orb.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = orb; ctx.beginPath(); ctx.arc(top.x, top.y, 14 * u, 0, 6.283); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
  }

  function draw(dt) {
    t += dt;
    if (dt > 0 && t >= nextSend) { send(); nextSend = t + SEND_EVERY * (0.6 + Math.random() * 0.8); }

    ctx.clearRect(0, 0, w, h);

    // floor grid — fades toward the edges, gently breathing
    ctx.lineWidth = 1 * u;
    for (let i = 0; i <= N; i++) {
      const k = i - 0.5;
      const fade = 1 - Math.abs(k - (N - 1) / 2) / (N / 2 + 0.5);
      ctx.strokeStyle = `rgba(${day() ? "11, 44, 95" : "148, 197, 255"}, ${((day() ? .10 : .04) + .05 * fade) * (0.85 + 0.15 * Math.sin(t * 0.6))})`;
      let a = iso(k, -0.5), b = iso(k, N - 0.5);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      a = iso(-0.5, k); b = iso(N - 0.5, k);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    // cable traces on the floor
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    routes.forEach(r => {
      r.glow *= Math.pow(0.2, dt);
      ctx.strokeStyle = `hsla(${r.hue}, 60%, ${day() ? 35 : 65}%, ${0.13 + r.glow * 0.5})`;
      ctx.lineWidth = (1.2 + r.glow * 1.6) * u;
      ctx.beginPath(); r.pts.forEach((p, i) => { const q = iso(p.x, p.y); ctx[i ? "lineTo" : "moveTo"](q.x, q.y); }); ctx.stroke();
    });

    // floor ripples (diamonds)
    ripples = ripples.filter(rp => {
      rp.r += dt * 1.4; rp.a *= Math.pow(0.18, dt);
      const s = rp.s + rp.r;
      poly([iso(rp.x - s, rp.y - s), iso(rp.x + s, rp.y - s), iso(rp.x + s, rp.y + s), iso(rp.x - s, rp.y + s)]);
      ctx.strokeStyle = `hsla(${rp.hue}, 75%, 75%, ${rp.a})`; ctx.lineWidth = 1.2 * u; ctx.stroke();
      return rp.a > 0.02;
    });

    // packets
    ctx.globalCompositeOperation = day() ? "source-over" : "lighter";
    packets = packets.filter(pk => {
      pk.p += dt / pk.dur;
      const k = ease(Math.min(pk.p, 1)), r = pk.r;
      r.glow = Math.max(r.glow, 0.7); r.hue = pk.hue;
      const d = (pk.inbound ? k : 1 - k) * r.len, dir = pk.inbound ? -1 : 1;
      for (let i = 11; i >= 0; i--) {
        const q = posOn(r, d + dir * i * 0.07), p = iso(q.x, q.y), f = 1 - i / 12;
        ctx.fillStyle = `hsla(${pk.hue}, 85%, ${(day() ? 30 : 70) + f * 20}%, ${f * 0.6})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, (0.5 + f * 2.3) * u, 0, 6.283); ctx.fill();
      }
      const q = posOn(r, d), p = iso(q.x, q.y);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12 * u);
      g.addColorStop(0, `hsla(${pk.hue}, 90%, ${day() ? 35 : 85}%, .55)`); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, 12 * u, 0, 6.283); ctx.fill();
      if (pk.p >= 1) { hit(pk.inbound ? nodes[0] : r.node, pk.hue); return false; }
      return true;
    });
    ctx.globalCompositeOperation = "source-over";

    // blocks, back to front
    [...nodes].sort((a, b) => (a.x + a.y) - (b.x + b.y)).forEach(n => {
      n.glow *= Math.pow(0.2, dt);
      drawBlock(n);
    });


  }

  let raf=null;
  function frame(now) { raf=null;if(root.dataset.animationState!=='running') return;const dt=Math.min((now-last)/1000,.05);last=now;draw(dt);raf=requestAnimationFrame(frame); }
  function stop() { if(raf!==null) cancelAnimationFrame(raf);raf=null; }
  function start() { if(raf!==null || root.dataset.animationState!=='running') return;last=performance.now();raf=requestAnimationFrame(frame); }
  const stateObserver=new MutationObserver(()=>root.dataset.animationState==='running'?start():stop());stateObserver.observe(root,{attributes:true,attributeFilter:['data-animation-state']});
  const themeObserver=new MutationObserver(()=>draw(0));themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-hero-theme']});
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(canvas);resize();canvas.parentElement.dataset.networkReady='true';
  return {play:start,settle(){stop();packets=[];ripples=[];t=7;nodes.forEach(n=>n.glow=n.hub?.5:.2);routes.forEach(r=>r.glow=.2);draw(0);},duration:12000,dispose(){stop();stateObserver.disconnect();themeObserver.disconnect();sizeObserver.disconnect();}};
}

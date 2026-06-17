/* ─────────────────────────────────────────────────────────
   BBH — antigravity background
   Soft drifting particle field that repels from the cursor.
   Call startBg() once the #bbh-bg canvas is in the DOM.
   ───────────────────────────────────────────────────────── */

export function startBg() {
  const canvas = document.getElementById("bbh-bg");
  if (!canvas) {
    // canvas not yet — retry shortly
    return setTimeout(startBg, 60);
  }
  const ctx = canvas.getContext("2d");

  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let mouse = { x: -9999, y: -9999, active: false, sx: -9999, sy: -9999 };
  let raf = null;

  const DENSITY = 0.000085; // particles per pixel² → ~140 on a 1440×900 viewport
  const REPEL_R = 170;      // px radius where cursor pushes particles
  const GLOW_R = 240;       // px radius where particles brighten/turn accent
  const LINK_R = 130;       // px — connect particles within this radius
  const LINK_MAX = 4;       // cap per particle to keep it sparse

  function size() {
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    const N = Math.max(60, Math.min(220, Math.round(W * H * DENSITY)));
    particles = new Array(N).fill(0).map(() => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r:  0.7 + Math.random() * 1.6,
      seed: Math.random() * Math.PI * 2,
    }));
  }

  function readVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function tick(t) {
    const dark = document.documentElement.dataset.theme === "dark";
    const accent = readVar("--accent") || "oklch(0.68 0.15 55)";
    const dotBase = dark ? "rgba(220,220,230,0.42)" : "rgba(40,40,48,0.42)";
    const dotMute = dark ? "rgba(220,220,230,0.18)" : "rgba(40,40,48,0.18)";
    const linkBase = dark ? "rgba(220,220,230,0.10)" : "rgba(40,40,48,0.09)";

    // smooth-follow cursor for the glow halo
    if (mouse.active) {
      mouse.sx += (mouse.x - mouse.sx) * 0.16;
      mouse.sy += (mouse.y - mouse.sy) * 0.16;
    }

    ctx.clearRect(0, 0, W, H);

    // soft accent halo where the cursor is
    if (mouse.active) {
      const g = ctx.createRadialGradient(mouse.sx, mouse.sy, 0, mouse.sx, mouse.sy, GLOW_R);
      g.addColorStop(0, withAlpha(accent, 0.14));
      g.addColorStop(1, withAlpha(accent, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // update particles
    for (const p of particles) {
      // gentle drift — sinusoidal, framerate-independent enough at 60fps
      p.vx += Math.cos(t * 0.0003 + p.seed) * 0.0035;
      p.vy += Math.sin(t * 0.00027 + p.seed * 1.3) * 0.0035;

      // antigravity: push away from cursor
      if (mouse.active) {
        const dx = p.x - mouse.sx;
        const dy = p.y - mouse.sy;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_R * REPEL_R && d2 > 0.5) {
          const d = Math.sqrt(d2);
          const force = (1 - d / REPEL_R);
          p.vx += (dx / d) * force * 0.55;
          p.vy += (dy / d) * force * 0.55;
        }
      }

      // damping
      p.vx *= 0.94;
      p.vy *= 0.94;

      // cap velocity
      const v = Math.hypot(p.vx, p.vy);
      const VMAX = 2.4;
      if (v > VMAX) { p.vx = p.vx / v * VMAX; p.vy = p.vy / v * VMAX; }

      p.x += p.vx;
      p.y += p.vy;

      // wrap with a small margin
      const M = 20;
      if (p.x < -M) p.x = W + M;
      else if (p.x > W + M) p.x = -M;
      if (p.y < -M) p.y = H + M;
      else if (p.y > H + M) p.y = -M;
    }

    // draw connecting lines (sparse)
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      let links = 0;
      const a = particles[i];
      for (let j = i + 1; j < particles.length && links < LINK_MAX; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_R * LINK_R) {
          const d = Math.sqrt(d2);
          const fade = 1 - d / LINK_R;
          let stroke = linkBase;
          if (mouse.active) {
            const md = Math.min(
              Math.hypot(a.x - mouse.sx, a.y - mouse.sy),
              Math.hypot(b.x - mouse.sx, b.y - mouse.sy),
            );
            if (md < GLOW_R) {
              const mix = (1 - md / GLOW_R);
              stroke = mixAlpha(linkBase, accent, mix * 0.6);
            }
          }
          ctx.strokeStyle = stroke;
          ctx.globalAlpha = fade * 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          links++;
        }
      }
    }
    ctx.globalAlpha = 1;

    // draw dots
    for (const p of particles) {
      let color = dotMute;
      let r = p.r;
      if (mouse.active) {
        const dx = p.x - mouse.sx;
        const dy = p.y - mouse.sy;
        const d = Math.hypot(dx, dy);
        if (d < GLOW_R) {
          const k = 1 - d / GLOW_R;
          if (k > 0.45) {
            color = withAlpha(accent, 0.35 + k * 0.55);
            r = p.r * (1 + k * 0.7);
          } else {
            color = mixAlpha(dotMute, dotBase, k * 2.2);
          }
        }
      } else {
        color = dotBase;
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(tick);
  }

  // tiny helpers — accept hex/oklch/rgb strings and add alpha by overlaying
  function withAlpha(c, a) {
    const cs = c.trim();
    if (cs.startsWith("oklch(")) {
      const inner = cs.slice(6, -1);
      return `oklch(${inner} / ${a})`;
    }
    if (cs.startsWith("#")) {
      const h = cs.length === 4
        ? cs.slice(1).split("").map((x) => parseInt(x + x, 16))
        : [parseInt(cs.slice(1, 3), 16), parseInt(cs.slice(3, 5), 16), parseInt(cs.slice(5, 7), 16)];
      return `rgba(${h[0]},${h[1]},${h[2]},${a})`;
    }
    if (cs.startsWith("rgb")) {
      return cs.replace(/rgba?\(([^)]+)\)/, (_, p) => {
        const parts = p.split(",").slice(0, 3).map((s) => s.trim());
        return `rgba(${parts.join(",")},${a})`;
      });
    }
    return cs;
  }

  function mixAlpha(base, accent, mix) {
    // approximate: nudge base alpha up + tint by accent ratio
    return withAlpha(accent, mix);
  }

  // wiring
  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    if (!mouse.active) {
      mouse.sx = e.clientX - rect.left;
      mouse.sy = e.clientY - rect.top;
    }
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }
  function onLeave() { mouse.active = false; }

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", onLeave);
  window.addEventListener("blur", onLeave);

  let resizeT;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { size(); seed(); }, 120);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else if (!raf) {
      raf = requestAnimationFrame(tick);
    }
  });

  size();
  seed();
  raf = requestAnimationFrame(tick);
}

import { initWasm } from "./wasm/logo_math_api.js";

const stage = document.querySelector(".stage");
const logoWrap = document.getElementById("logo-wrap");
const sensorBtn = document.getElementById("sensor-btn");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  px: 0,
  py: 0,
  pvx: 0,
  pvy: 0,
  tx: 0,
  ty: 0,
  tiltX: 0,
  tiltY: 0,
  lastMotionMag: 0,
  shakeEnergy: 0,
  burstAt: -999,
  chaos: 0,
  quality: 1,
};

let math;
let logoSvg;
let fxNodes;
let rafId;

async function loadInlineLogo() {
  const response = await fetch("./buildbyhenri.svg");
  const text = await response.text();
  logoWrap.innerHTML = text;

  logoSvg = logoWrap.querySelector("svg");
  if (!logoSvg) throw new Error("SVG could not be injected");

  logoSvg.setAttribute("aria-hidden", "true");
  logoSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  logoSvg.style.transformOrigin = "center center";
  logoSvg.style.willChange = "transform, filter";

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <filter id="logoFx" x="-20%" y="-30%" width="140%" height="170%" color-interpolation-filters="sRGB">
      <feTurbulence id="fxNoise" type="fractalNoise" baseFrequency="0.008 0.015" numOctaves="2" seed="7" result="noise" />
      <feDisplacementMap id="fxDisp" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="distorted" />
      <feColorMatrix id="fxColor" in="distorted" type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 1 0" result="colored" />
      <feGaussianBlur in="colored" stdDeviation="0" result="soft" />
      <feBlend mode="screen" in="colored" in2="soft" />
    </filter>
  `;

  logoSvg.insertBefore(defs, logoSvg.firstChild);
  logoSvg.querySelector("g")?.setAttribute("filter", "url(#logoFx)");

  fxNodes = {
    noise: logoSvg.querySelector("#fxNoise"),
    disp: logoSvg.querySelector("#fxDisp"),
    color: logoSvg.querySelector("#fxColor"),
  };
}

function requestSensorPermissionIfNeeded() {
  if (!window.DeviceMotionEvent && !window.DeviceOrientationEvent) return;

  const needsPermission =
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function";

  if (!needsPermission) {
    bindSensorListeners();
    return;
  }

  sensorBtn.hidden = false;
  sensorBtn.addEventListener(
    "click",
    async () => {
      try {
        const [motion, orient] = await Promise.all([
          DeviceMotionEvent.requestPermission(),
          typeof DeviceOrientationEvent?.requestPermission === "function"
            ? DeviceOrientationEvent.requestPermission()
            : Promise.resolve("granted"),
        ]);

        if (motion === "granted" || orient === "granted") {
          bindSensorListeners();
          sensorBtn.hidden = true;
        }
      } catch (error) {
        console.warn("Sensor permission denied", error);
      }
    },
    { once: true }
  );
}

function bindSensorListeners() {
  window.addEventListener(
    "deviceorientation",
    (event) => {
      const gamma = Number.isFinite(event.gamma) ? event.gamma : 0;
      const beta = Number.isFinite(event.beta) ? event.beta : 0;
      state.tiltX = Math.max(-1, Math.min(1, gamma / 45));
      state.tiltY = Math.max(-1, Math.min(1, beta / 60));
    },
    { passive: true }
  );

  window.addEventListener(
    "devicemotion",
    (event) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;
      const magnitude = Math.hypot(x, y, z);
      state.lastMotionMag = math.smooth(state.lastMotionMag, magnitude, 12, 1 / 60);

      const highPass = Math.max(0, magnitude - state.lastMotionMag);
      if (highPass > 8.5) triggerBurst(highPass * 0.14);
      state.shakeEnergy = Math.min(2.8, state.shakeEnergy + highPass * 0.022);
    },
    { passive: true }
  );
}

function bindPointerListeners() {
  let lastX = window.innerWidth * 0.5;
  let lastY = window.innerHeight * 0.5;

  window.addEventListener(
    "pointermove",
    (event) => {
      const cx = window.innerWidth * 0.5;
      const cy = window.innerHeight * 0.5;
      const nx = (event.clientX - cx) / cx;
      const ny = (event.clientY - cy) / cy;

      state.tx = Math.max(-1, Math.min(1, nx));
      state.ty = Math.max(-1, Math.min(1, ny));

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      state.pvx = math.smooth(state.pvx, dx * 0.09, 20, 1 / 60);
      state.pvy = math.smooth(state.pvy, dy * 0.09, 20, 1 / 60);

      const flick = Math.hypot(dx, dy);
      if (flick > 48) triggerBurst(flick * 0.0065);
    },
    { passive: true }
  );

  window.addEventListener(
    "wheel",
    (event) => {
      const spin = Math.min(2.2, Math.abs(event.deltaY) / 140);
      state.shakeEnergy = Math.min(3.2, state.shakeEnergy + spin * 0.2);
      triggerBurst(spin * 0.22);
    },
    { passive: true }
  );
}

function triggerBurst(intensity = 0.5) {
  const now = performance.now() * 0.001;
  if (now - state.burstAt < 0.34) return;

  state.burstAt = now;
  state.shakeEnergy = Math.min(4, state.shakeEnergy + intensity);
}

function buildColorMatrix(shift) {
  const r = 1 + shift * 0.06;
  const g = 1 - shift * 0.04;
  const b = 1 + shift * 0.09;
  const rbias = shift * 0.03;
  const gbias = -shift * 0.02;
  const bbias = shift * 0.016;

  return `${r} 0 0 0 ${rbias}
          0 ${g} 0 0 ${gbias}
          0 0 ${b} 0 ${bbias}
          0 0 0 1 0`;
}

function animate() {
  let previous = performance.now();

  const frame = (nowMs) => {
    const now = nowMs * 0.001;
    const dt = Math.min(0.033, (nowMs - previous) * 0.001 || 0.016);
    previous = nowMs;

    if (document.hidden) {
      rafId = requestAnimationFrame(frame);
      return;
    }

    const targetX = state.tx + state.tiltX * 0.85;
    const targetY = state.ty + state.tiltY * 0.85;

    state.px = math.smooth(state.px, targetX, 8.2, dt);
    state.py = math.smooth(state.py, targetY, 8.2, dt);

    const motion = Math.hypot(state.pvx, state.pvy) * 0.04;
    state.shakeEnergy = Math.max(0, state.shakeEnergy - dt * 1.45);

    const sinceBurst = now - state.burstAt;
    const burstWave = state.burstAt < 0 ? 0 : Math.max(0, math.envelope(sinceBurst));

    const hashA = math.hash2(Math.round(now * 600), 97) >>> 0;
    const hashB = math.hash2(Math.round(now * 510), 193) >>> 0;
    const noiseX = ((hashA % 200) - 100) / 100;
    const noiseY = ((hashB % 200) - 100) / 100;

    const chaosTarget = math.clamp(
      state.shakeEnergy * 0.45 + motion + burstWave * 1.2,
      0,
      prefersReducedMotion ? 0.32 : 1.6
    );

    state.chaos = math.smooth(state.chaos, chaosTarget, 5.8, dt);

    const jitter = prefersReducedMotion ? 0.45 : 1;
    const tx = state.px * 24 + noiseX * state.chaos * 8 * jitter;
    const ty = state.py * 18 + noiseY * state.chaos * 6 * jitter;
    const rot = state.px * 7 - state.py * 4 + burstWave * 14;
    const rx = state.py * -13 - state.tiltY * 9;
    const ry = state.px * 14 + state.tiltX * 8;
    const skewX = state.px * 5 + burstWave * 7;
    const skewY = state.py * -4;
    const scale = 1 + Math.min(0.36, state.chaos * 0.13 + burstWave * 0.08);

    logoWrap.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rot}deg) skew(${skewX}deg, ${skewY}deg) scale(${scale})`;

    if (!fxNodes || prefersReducedMotion) {
      if (logoSvg) {
        logoSvg.style.filter = `drop-shadow(0 8px 18px rgb(0 0 0 / ${0.2 + state.chaos * 0.2}))`;
      }
      rafId = requestAnimationFrame(frame);
      return;
    }

    const turbulenceX = 0.008 + state.chaos * 0.006 + burstWave * 0.005;
    const turbulenceY = 0.015 + state.chaos * 0.014 + burstWave * 0.008;
    const displacement = Math.min(56, state.chaos * 28 + burstWave * 26);

    fxNodes.noise.setAttribute("baseFrequency", `${turbulenceX.toFixed(4)} ${turbulenceY.toFixed(4)}`);
    fxNodes.disp.setAttribute("scale", displacement.toFixed(2));
    fxNodes.color.setAttribute("values", buildColorMatrix(state.chaos + burstWave * 1.2));

    logoSvg.style.filter = `drop-shadow(0 10px ${20 + state.chaos * 32}px rgb(0 0 0 / ${0.16 + state.chaos * 0.16}))`;

    if (dt > 0.03) {
      state.quality = Math.max(0.62, state.quality - 0.03);
    } else {
      state.quality = Math.min(1, state.quality + 0.012);
    }

    if (state.quality < 1) {
      const qScale = 0.75 + state.quality * 0.25;
      fxNodes.disp.setAttribute("scale", (displacement * qScale).toFixed(2));
    }

    rafId = requestAnimationFrame(frame);
  };

  rafId = requestAnimationFrame(frame);
}

async function init() {
  math = await initWasm();
  await loadInlineLogo();
  bindPointerListeners();
  requestSensorPermissionIfNeeded();
  animate();

  window.addEventListener("resize", () => {
    state.tx = 0;
    state.ty = 0;
  });

  window.addEventListener("beforeunload", () => {
    if (rafId) cancelAnimationFrame(rafId);
  });
}

init().catch((error) => {
  console.error(error);
  stage.innerHTML = "";
  const fallback = document.createElement("img");
  fallback.src = "./buildbyhenri.svg";
  fallback.alt = "buildbyhenri logo";
  fallback.style.width = "min(82vw, 820px)";
  stage.appendChild(fallback);
});

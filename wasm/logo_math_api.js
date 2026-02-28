export async function initWasm(url = "./wasm/logo_math.wasm") {
  let instance;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("WASM fetch failed");

    if (WebAssembly.instantiateStreaming) {
      ({ instance } = await WebAssembly.instantiateStreaming(response, {}));
    } else {
      const bytes = await response.arrayBuffer();
      ({ instance } = await WebAssembly.instantiate(bytes, {}));
    }
  } catch (error) {
    console.warn("WASM unavailable, using JS fallback", error);
    instance = {
      exports: {
        add: (a, b) => (a | 0) + (b | 0),
        mul: (a, b) => Math.imul(a | 0, b | 0),
        hash2: (a, b) => (((a | 0) * 31 + (b | 0) * 17 + 101) ^ ((a | 0) << 2)) | 0,
      },
    };
  }

  const { add, mul, hash2 } = instance.exports;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const toInt = (value, scale = 1000) => Math.round(value * scale) | 0;

  return {
    add,
    mul,
    hash2,
    smooth(current, target, lambda, dt) {
      const alpha = 1 - Math.exp(-lambda * dt);
      return current + (target - current) * alpha;
    },
    scaledMul(a, b, scale = 1000) {
      const left = toInt(a, scale);
      const right = toInt(b, scale);
      return mul(left, right) / (scale * scale);
    },
    noise(seed, x, y) {
      const xi = toInt(x + seed * 0.131, 1000);
      const yi = toInt(y - seed * 0.217, 1000);
      const mixed = hash2(xi, yi) >>> 0;
      return (mixed % 2000) / 1000 - 1;
    },
    envelope(t) {
      const clamped = clamp(t, 0, 2.5);
      return Math.exp(-3.6 * clamped) * Math.sin(25 * clamped);
    },
    clamp,
  };
}

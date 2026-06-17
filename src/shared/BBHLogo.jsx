/* ────────────────────────────────────────────────────────────
   BBH grid mark — shared brand component
   2×2 grid · lowercase b/b/h · amber 4th cell w/ dot
   Font: Comfortaa (monolinear)
   Rendered as inline SVG so it stays crisp at any size and
   inverts cleanly via CSS-variable-driven fills.
   ──────────────────────────────────────────────────────────── */

import React from "react";

function BBHLogo({
  size = 28,
  variant = "auto",   // "light" | "dark" | "amber" | "auto"
  radius,             // override corner radius (in SVG units, 0–64)
  title = "BBH",
}) {
  const clipId = React.useId();
  const isDark  = variant === "dark";
  const isAmber = variant === "amber";

  // Theme-aware fills via CSS variables.
  // The cell background = page bg, the line/border = page border,
  // letters = ink, accent cell = brand accent.
  const cellFill = isDark  ? "var(--ink)"
                : isAmber  ? "#ffffff"
                : "var(--bg)";

  const lineFill = isAmber ? "rgba(0,0,0,.16)"
                : isDark   ? "rgba(255,255,255,.18)"
                : "var(--border)";

  const inkFill  = isDark  ? "var(--bg)" : "var(--ink)";
  const dotFill  = isAmber ? "var(--ink)" : "#ffffff";
  const accentFill = "var(--accent)";

  const rx = radius != null ? radius : 11;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      <title>{title}</title>
      <defs>
        <clipPath id={clipId}>
          <rect width="64" height="64" rx={rx} ry={rx} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* grid lines + outer border in one fill */}
        <rect width="64" height="64" fill={lineFill} />
        {/* four cells */}
        <rect x="1"    y="1"    width="30.5" height="30.5" fill={cellFill} />
        <rect x="32.5" y="1"    width="30.5" height="30.5" fill={cellFill} />
        <rect x="1"    y="32.5" width="30.5" height="30.5" fill={cellFill} />
        <rect x="32.5" y="32.5" width="30.5" height="30.5" fill={accentFill} />

        {/* letters */}
        <text x="16.25" y="16.25"
              textAnchor="middle" dominantBaseline="central"
              fill={inkFill}
              fontFamily='"Comfortaa", ui-sans-serif, system-ui, sans-serif'
              fontWeight={700}
              fontSize={24}
              letterSpacing={-1}>b</text>
        <text x="47.75" y="16.25"
              textAnchor="middle" dominantBaseline="central"
              fill={inkFill}
              fontFamily='"Comfortaa", ui-sans-serif, system-ui, sans-serif'
              fontWeight={700}
              fontSize={24}
              letterSpacing={-1}>b</text>
        <text x="16.25" y="47.75"
              textAnchor="middle" dominantBaseline="central"
              fill={inkFill}
              fontFamily='"Comfortaa", ui-sans-serif, system-ui, sans-serif'
              fontWeight={700}
              fontSize={24}
              letterSpacing={-1}>h</text>

        {/* accent dot */}
        <circle cx="47.75" cy="47.75" r="4.48" fill={dotFill} />
      </g>
    </svg>
  );
}

export { BBHLogo };

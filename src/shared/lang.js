/* ────────────────────────────────────────────────────────────
   Shared language preference — consistent across all pages.

   Initial language:
   1. a saved choice in localStorage ("bbh-lang"), if valid; else
   2. the browser/user language (navigator) → "pt" for pt-*, else "en".

   When the user toggles the language, persistLang() saves it so the
   choice carries across pages and future visits.
   ──────────────────────────────────────────────────────────── */

export const LANG_KEY = "bbh-lang";
const SUPPORTED = ["en", "pt"];

export function getInitialLang() {
  // 1. explicit user choice wins
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (SUPPORTED.includes(saved)) return saved;
  } catch (e) { /* localStorage unavailable — fall through */ }

  // 2. fall back to the browser/user language
  try {
    const nav = navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;
    if (nav && String(nav).toLowerCase().startsWith("pt")) return "pt";
  } catch (e) { /* no navigator — fall through */ }

  return "en";
}

export function persistLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
}

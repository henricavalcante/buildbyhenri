/* ────────────────────────────────────────────────────────────────
   apps.buildbyhenri.com — product showcase
   (BBH's own apps — not a service we sell)
   ──────────────────────────────────────────────────────────────── */

import React from "react";
import { BBHLogo } from "../shared/BBHLogo.jsx";
import {
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect,
  TweakColor, TweakToggle,
} from "../shared/tweaks-panel.jsx";
import { STRINGS } from "./strings.js";
import { getInitialLang, persistLang } from "../shared/lang.js";

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#7a5ae0",
  "dark": false,
  "lang": "en",
  "display": "mono",
  "showStack": true
}/*EDITMODE-END*/;

/* ────────── Helpers ────────── */

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/* Render a title with an italicized accent phrase highlighted inside it */
function Highlight({ text, italic }) {
  if (!italic || !text.includes(italic)) return <>{text}</>;
  const i = text.indexOf(italic);
  return (
    <>
      {text.slice(0, i)}
      <em>{italic}</em>
      {text.slice(i + italic.length)}
    </>
  );
}

/* ────────── Lang toggle ────────── */

function LangToggle({ lang, onChange }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        className={"lang-btn" + (lang === "en" ? " is-on" : "")}
        onClick={() => onChange("en")} type="button"
      >EN</button>
      <span className="lang-sep">/</span>
      <button
        className={"lang-btn" + (lang === "pt" ? " is-on" : "")}
        onClick={() => onChange("pt")} type="button"
      >PT</button>
    </div>
  );
}

/* ────────── Nav ────────── */

function Nav({ s, lang, setLang }) {
  const scrolled = useScrolled();
  return (
    <header className={"nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="container nav-inner">
        <a href="./index.html" className="brand" aria-label="BBH apps">
          <BBHLogo size={28} />
          <span>BBH<small> / apps</small></span>
        </a>
        <nav className="nav-links">
          <a href="#work"  className="nav-only-desktop">{s.nav.work}</a>
          <a href="#stack" className="nav-only-desktop">{s.nav.stack}</a>
          <LangToggle lang={lang} onChange={setLang} />
          <a href="./index.html" className="btn btn-ghost" style={{ padding: "7px 14px" }}>
            {s.nav.studio} <span className="btn-arrow"></span>
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ────────── Hero "recent builds" aside ────────── */

function RecentBuilds({ s }) {
  return (
    <div className="builds-card" aria-label="Recent builds">
      <div className="builds-head">
        <span className="builds-title">{s.builds.label}</span>
      </div>
      <ul className="builds-list">
        {s.apps.slice(0, 4).map((a) => (
          <li key={a.name} className="builds-item">
            <span className="nm">{a.name}</span>
            <span className="app-status" data-status={a.status}>{s.statusLabels[a.status]}</span>
          </li>
        ))}
      </ul>
      <div className="builds-foot">{s.builds.foot}</div>
    </div>
  );
}

/* ────────── Hero ────────── */

function Hero({ s }) {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <span className="hero-tag">
            <span className="pill">{s.hero.version}</span>
            {s.hero.tag}
          </span>
          <h1 className="h-display">
            <Highlight text={s.hero.headline} italic={s.hero.headlineItalic} />
          </h1>
          <p className="hero-sub">{s.hero.sub}</p>
          <div className="hero-ctas">
            <a href="#work" className="btn btn-primary">
              {s.hero.ctaWork} <span className="btn-arrow"></span>
            </a>
            <span className="hero-note">{s.hero.note}</span>
          </div>
        </div>
        <RecentBuilds s={s} />
      </div>
    </section>
  );
}

/* ────────── App card + Work grid ────────── */

function AppCard({ app, statusLabels, visit }) {
  const external = typeof app.href === "string" && app.href.startsWith("http");
  return (
    <a
      className="app-card"
      href={app.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
    >
      <div className="app-thumb">
        <span className="mark" aria-hidden="true">{app.name.charAt(0)}</span>
      </div>
      <div className="app-body">
        <div className="app-head">
          <span className="app-name">{app.name}</span>
          <span className="app-status" data-status={app.status}>{statusLabels[app.status]}</span>
        </div>
        <div className="app-oneliner">{app.oneLiner}</div>
        <p className="app-desc">{app.desc}</p>
        <div className="app-stack">
          {app.stack.map((tech) => <span key={tech} className="chip">{tech}</span>)}
        </div>
        <div className="app-foot">
          <span className="app-link">{visit}</span>
          <span className="app-arrow" aria-hidden="true">↗</span>
        </div>
      </div>
    </a>
  );
}

function Work({ s }) {
  return (
    <section className="section" id="work">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{s.work.eyebrow}</span>
          <h2 className="h-section">
            <Highlight text={s.work.title} italic={s.work.titleItalic} />
          </h2>
        </div>
        <div className="work-grid">
          {s.apps.map((a) => (
            <AppCard key={a.name} app={a} statusLabels={s.statusLabels} visit={s.work.visit} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Built-with strip ────────── */

function Stacks({ s }) {
  return (
    <section className="section" id="stack">
      <div className="container">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">{s.stack.label}</span>
          <div className="stacks">
            {s.stack.items.map((name) => (
              <span key={name} className="stack-chip">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── Footer ────────── */

function Footer({ s }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          BBH · apps
          <span className="divider-dot"></span>
          {s.footer.tag}
        </div>
        <div>
          <a href="mailto:contact@buildbyhenri.com">contact@buildbyhenri.com</a>
          <span className="divider-dot"></span>
          CNPJ 15.382.422/0001-46
          <span className="divider-dot"></span>
          © 2012–{new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}

/* ────────── App ────────── */

function App() {
  const [t, setTweak] = useTweaks({ ...TWEAK_DEFAULTS, lang: getInitialLang() });

  const lang = t.lang === "pt" ? "pt" : "en";
  const s = STRINGS[lang];

  useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.display = t.display || "hanken";
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.lang = s.locale;
  }, [t.dark, t.display, t.accent, s.locale]);

  const setLang = (l) => { persistLang(l); setTweak("lang", l); };

  return (
    <>
      <Nav s={s} lang={lang} setLang={setLang} />
      <main>
        <Hero s={s} />
        <Work s={s} />
        {t.showStack && <Stacks s={s} />}
      </main>
      <Footer s={s} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Language" />
        <TweakRadio label="Locale" value={lang}
          options={["en", "pt"]}
          onChange={setLang} />

        <TweakSection label="Theme" />
        <TweakSelect label="Display font" value={t.display || "hanken"}
          options={[
            { value: "hanken",  label: "Hanken Grotesk (default)" },
            { value: "dmsans",  label: "DM Sans" },
            { value: "geist",   label: "Geist" },
            { value: "mono",    label: "JetBrains Mono" },
            { value: "serif",   label: "Instrument Serif" },
          ]}
          onChange={(v) => setTweak("display", v)} />
        <TweakColor label="Accent" value={t.accent}
          options={["#7a5ae0", "#2a6fdb", "#1ea861", "#d97757"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakToggle label="Dark mode" value={t.dark}
          onChange={(v) => setTweak("dark", v)} />

        <TweakSection label="Sections" />
        <TweakToggle label="Show stack strip" value={t.showStack}
          onChange={(v) => setTweak("showStack", v)} />
      </TweaksPanel>
    </>
  );
}

export { App };

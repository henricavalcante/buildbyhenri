/* ────────────────────────────────────────────────────────────────
   consulting.buildbyhenri.com — portfolio of consulting work
   (the companies & teams I've advised — not a service storefront)
   ──────────────────────────────────────────────────────────────── */

import React from "react";
import { BBHLogo } from "../shared/BBHLogo.jsx";
import {
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect,
  TweakColor, TweakToggle,
} from "../shared/tweaks-panel.jsx";
import { STRINGS } from "./strings.js";

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2a6fdb",
  "dark": false,
  "lang": "en",
  "display": "mono",
  "showContact": true
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
        <a href="#top" className="brand" aria-label="BBH consulting">
          <BBHLogo size={28} />
          <span>BBH<small> / consulting</small></span>
        </a>
        <nav className="nav-links">
          <a href="#work"    className="nav-only-desktop">{s.nav.work}</a>
          <a href="#contact" className="nav-only-desktop">{s.nav.contact}</a>
          <LangToggle lang={lang} onChange={setLang} />
          <a href="./index.html" className="btn btn-ghost" style={{ padding: "7px 14px" }}>
            {s.nav.studio} <span className="btn-arrow"></span>
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ────────── Hero "at a glance" aside ────────── */

function Glance({ s }) {
  return (
    <div className="glance-card" aria-label="At a glance">
      <div className="glance-head">
        <span className="glance-title">{s.glance.label}</span>
      </div>
      <ul className="glance-list">
        {s.glance.items.map((it) => (
          <li key={it.k} className="glance-item">
            <span className="k">{it.k}</span>
            <span className="v">{it.v}</span>
          </li>
        ))}
      </ul>
      <div className="glance-foot">{s.glance.foot}</div>
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
        <Glance s={s} />
      </div>
    </section>
  );
}

/* ────────── Company card + Work grid ────────── */

function CompanyCard({ company, visit }) {
  const external = typeof company.href === "string" && company.href.startsWith("http");
  const inner = (
    <>
      <div className="client-head">
        <span className="client-name">{company.name}</span>
        <span className="client-period">{company.period}</span>
      </div>
      <div className="client-role">{company.role}</div>
      <div className="client-meta">
        <span className="client-sector">{company.sector}</span>
      </div>
      <p className="client-did">{company.did}</p>
      {external && (
        <div className="client-foot">
          <span className="client-arrow" aria-hidden="true">↗</span>
        </div>
      )}
    </>
  );

  return external ? (
    <a className="client-card" href={company.href} target="_blank" rel="noopener" aria-label={`${company.name} — ${visit}`}>
      {inner}
    </a>
  ) : (
    <div className="client-card">{inner}</div>
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
          {s.companies.map((c) => (
            <CompanyCard key={c.name} company={c} visit={s.work.visit} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Contact ────────── */

function Contact({ s }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", stage: s.contact.stages[0], note: "" });

  useEffect(() => {
    setForm((f) => ({ ...f, stage: s.contact.stages[0] }));
  }, [s.contact.stages[0]]);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact">
          <div>
            <span className="eyebrow" style={{ color: "color-mix(in oklab, white 60%, transparent)" }}>
              {s.contact.eyebrow}
            </span>
            <h2 className="h-section" style={{ marginTop: 14 }}>
              {s.contact.titleA} <em>{s.contact.titleItalic}</em><br />
              {s.contact.titleB}
            </h2>
            <p className="contact-lead">{s.contact.lead}</p>
            <div className="contact-direct">
              <span>{s.contact.direct}</span>
              <a href="mailto:contact@buildbyhenri.com">contact@buildbyhenri.com</a>
            </div>
          </div>

          <form className="contact-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="name">{s.contact.fields.name}</label>
              <input id="name" type="text" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="email">{s.contact.fields.email}</label>
              <input id="email" type="email" required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="stage">{s.contact.fields.stage}</label>
              <select id="stage" value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                {s.contact.stages.map((st) => <option key={st}>{st}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="note">{s.contact.fields.note}</label>
              <textarea id="note" rows="3"
                placeholder={s.contact.fields.notePh}
                value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit">
              {sent ? s.contact.sent : s.contact.submit}
            </button>
            {sent && <div className="sent">{s.contact.sentMsg}</div>}
          </form>
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
          BBH · consulting
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
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const lang = t.lang === "pt" ? "pt" : "en";
  const s = STRINGS[lang];

  useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.dataset.display = t.display || "hanken";
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.lang = s.locale;
  }, [t.dark, t.display, t.accent, s.locale]);

  const setLang = (l) => setTweak("lang", l);

  return (
    <>
      <Nav s={s} lang={lang} setLang={setLang} />
      <main>
        <Hero s={s} />
        <Work s={s} />
        {t.showContact && <Contact s={s} />}
      </main>
      <Footer s={s} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Language" />
        <TweakRadio label="Locale" value={lang}
          options={["en", "pt"]}
          onChange={(v) => setTweak("lang", v)} />

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
          options={["#2a6fdb", "#1ea861", "#7a5ae0", "#d97757"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakToggle label="Dark mode" value={t.dark}
          onChange={(v) => setTweak("dark", v)} />

        <TweakSection label="Sections" />
        <TweakToggle label="Show contact" value={t.showContact}
          onChange={(v) => setTweak("showContact", v)} />
      </TweaksPanel>
    </>
  );
}

export { App };

/* ────────────────────────────────────────────────────────────────
   BuildByHenri — main hub
   ──────────────────────────────────────────────────────────────── */

import React from "react";
import { BBHLogo } from "../shared/BBHLogo.jsx";
import {
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle,
} from "../shared/tweaks-panel.jsx";
import { BBH_STRINGS } from "./strings.js";

const { useState, useEffect } = React;

const BBH_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "lang": "en"
}/*EDITMODE-END*/;

/* helpers */
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

function BBHHighlight({ text, italic }) {
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

/* ────────── Nav ────────── */
function BBHLangToggle({ lang, onChange }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button className={"lang-btn" + (lang === "en" ? " is-on" : "")}
              onClick={() => onChange("en")} type="button">EN</button>
      <span className="lang-sep">/</span>
      <button className={"lang-btn" + (lang === "pt" ? " is-on" : "")}
              onClick={() => onChange("pt")} type="button">PT</button>
    </div>
  );
}

function BBHNav({ s, lang, setLang }) {
  const scrolled = useScrolled();
  return (
    <header className={"nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="container nav-inner">
        <a href="#top" className="brand" aria-label="BBH">
          <BBHLogo size={28} />
          <span>BBH</span>
        </a>
        <div className="nav-meta">
          <span className="studio-tag">{s.nav.studio}</span>
          <BBHLangToggle lang={lang} onChange={setLang} />
        </div>
      </div>
    </header>
  );
}

/* ────────── Hero ────────── */
function BBHHero({ s }) {
  return (
    <section className="hero" id="top">
      <div className="container hero-inner">
        <h1 className="h-display">
          <BBHHighlight text={s.hero.headline} italic={s.hero.headlineItalic} />
        </h1>
        <p className="hero-sub">{s.hero.sub}</p>
        <div className="hero-foot">
          <span className="availability">
            <span className="dot"></span>
            {s.hero.availability}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ────────── Service card ────────── */
function BBHServiceCard({ item, visit }) {
  return (
    <a className="service-card" href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener">
      <div className="service-head">
        <span className="service-num">{item.n} / 03</span>
        <span className="service-tag">{item.tag}</span>
      </div>

      <h3 className="service-title">
        <BBHHighlight text={item.title} italic={item.titleItalic} />
      </h3>
      <p className="service-oneliner">{item.oneLiner}</p>

      <div className="service-details">
        <div className="inner">
          <ul className="service-bullets">
            {item.bullets.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
      </div>

      <div className="service-foot">
        <span className="service-cta">{visit}</span>
        <span className="service-arrow">↗</span>
      </div>
    </a>
  );
}

/* ────────── Services ────────── */
function BBHServices({ s }) {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="services-grid">
          {s.services.items.map((it) => (
            <BBHServiceCard key={it.n} item={it} visit={s.services.visit} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Footer ────────── */
function BBHFooter({ s }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          BBH
          <span className="divider-dot"></span>
          {s.footer.tag}
        </div>
        <div>
          <a href={"mailto:" + s.footer.direct}>{s.footer.direct}</a>
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
function BBHApp() {
  const [t, setTweak] = useTweaks(BBH_TWEAK_DEFAULTS);
  const lang = t.lang === "pt" ? "pt" : "en";
  const s = BBH_STRINGS[lang];

  useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.lang = s.locale;
  }, [t.dark, s.locale]);

  return (
    <>
      <BBHNav s={s} lang={lang} setLang={(l) => setTweak("lang", l)} />
      <main>
        <BBHHero s={s} />
        <BBHServices s={s} />
      </main>
      <BBHFooter s={s} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Language" />
        <TweakRadio label="Locale" value={lang}
          options={["en", "pt"]}
          onChange={(v) => setTweak("lang", v)} />

        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark}
          onChange={(v) => setTweak("dark", v)} />
      </TweaksPanel>
    </>
  );
}

export { BBHApp };

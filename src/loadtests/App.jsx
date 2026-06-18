/* ────────────────────────────────────────────────────────────────
   loadtests.buildbyhenri.com — landing
   ──────────────────────────────────────────────────────────────── */

import React from "react";
import { BBHLogo } from "../shared/BBHLogo.jsx";
import {
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect,
  TweakColor, TweakToggle,
} from "../shared/tweaks-panel.jsx";
import { STRINGS } from "./strings.js";
import { getInitialLang, persistLang } from "../shared/lang.js";

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1ea861",
  "dark": false,
  "lang": "en",
  "display": "mono",
  "showCalculator": true,
  "showRpsCard": true
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

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, "") + "k";
  return Math.round(n).toString();
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
        <a href="./index.html" className="brand" aria-label="BBH loadtests">
          <BBHLogo size={28} />
          <span>BBH<small> / loadtests</small></span>
        </a>
        <nav className="nav-links">
          <a href="#process"    className="nav-only-desktop">{s.nav.process}</a>
          <a href="#services"   className="nav-only-desktop">{s.nav.services}</a>
          <a href="#infrastructure" className="nav-only-desktop">{s.nav.infra}</a>
          <a href="#calculator" className="nav-only-desktop">{s.nav.estimate}</a>
          <a href="#about"      className="nav-only-desktop">{s.nav.about}</a>
          <LangToggle lang={lang} onChange={setLang} />
          <a href="#contact" className="btn btn-primary" style={{ padding: "7px 14px" }}>
            {s.nav.book} <span className="btn-arrow"></span>
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ────────── Live RPS meter ────────── */

function useLiveRps() {
  const POINTS = 64;
  const [history, setHistory] = useState(() =>
    Array.from({ length: POINTS }, (_, i) =>
      120_000 + Math.sin(i / 6) * 38_000 + Math.random() * 12_000
    )
  );
  const tickRef = useRef(0);

  useEffect(() => {
    let raf;
    let last = performance.now();
    const loop = (t) => {
      if (t - last > 220) {
        last = t;
        tickRef.current += 1;
        setHistory((prev) => {
          const next = prev.slice(1);
          const base = 165_000;
          const wave = Math.sin(tickRef.current / 8) * 42_000;
          const spike = Math.random() < 0.07 ? 28_000 : 0;
          const jitter = (Math.random() - 0.5) * 22_000;
          next.push(Math.max(60_000, base + wave + spike + jitter));
          return next;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const value = history[history.length - 1];
  const peak  = useMemo(() => Math.max(...history), [history]);
  const p95   = useMemo(() => {
    const sorted = [...history].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.95)];
  }, [history]);

  return { history, value, peak, p95 };
}

function RpsCard({ s }) {
  const { history, value, peak, p95 } = useLiveRps();
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = Math.max(1, max - min);
  const W = 320, H = 64;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 8) - 4;
    return [x, y];
  });
  const linePath = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const areaPath = linePath + ` L${W},${H} L0,${H} Z`;

  return (
    <div className="rps-card" aria-label="Live requests per second simulation">
      <div className="rps-head">
        <span className="rps-title">{s.rps.title}</span>
        <span className="rps-live"><span className="dot"></span> {s.rps.live}</span>
      </div>
      <div className="rps-value">
        <span className="num tnum">{formatNumber(value)}</span>
        <span className="unit">{s.rps.unit}</span>
      </div>
      <div className="rps-chart">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <line className="grid" x1="0" y1={H * 0.25} x2={W} y2={H * 0.25} />
          <line className="grid" x1="0" y1={H * 0.55} x2={W} y2={H * 0.55} />
          <line className="grid" x1="0" y1={H * 0.85} x2={W} y2={H * 0.85} />
          <path className="area" d={areaPath} />
          <path className="line" d={linePath} />
        </svg>
      </div>
      <div className="rps-meta">
        <div className="rps-meta-item">
          <div className="k">{s.rps.peak}</div>
          <div className="v tnum">{formatNumber(peak)}</div>
        </div>
        <div className="rps-meta-item">
          <div className="k">{s.rps.p95}</div>
          <div className="v tnum">{(120 + (peak - p95) / 6000).toFixed(0)}ms</div>
        </div>
        <div className="rps-meta-item">
          <div className="k">{s.rps.err}</div>
          <div className="v tnum">0.02%</div>
        </div>
      </div>
      <div className="rps-foot">
        <span>{s.rps.scenario}</span>
        <span className="ok">● {s.rps.status}</span>
      </div>
    </div>
  );
}

/* ────────── Hero ────────── */

function Hero({ s, showRps }) {
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
            <a href="#contact" className="btn btn-primary">
              {s.hero.ctaPrimary} <span className="btn-arrow"></span>
            </a>
            <a href="#services" className="btn btn-ghost">
              {s.hero.ctaSecondary}
            </a>
            <span className="availability">
              <span className="dot"></span>
              {s.hero.availability}
            </span>
          </div>
        </div>
        {showRps && <RpsCard s={s} />}
      </div>
    </section>
  );
}

/* ────────── Logo strip ────────── */

const LOGOS = [
  { name: "Amazon",      src: "https://k6.io/static/amazon-a8a3f55484b0e7d30c3ab0ae416cc69d.svg" },
  { name: "NOAA",        src: "https://k6.io/static/noaa-7fbe83bf43a3e1b9681893cc82ebc43b.svg" },
  { name: "Sephora",     src: "https://k6.io/static/sephora-922efcf5b1b703d5a04fa7c3b4aa1d36.svg" },
  { name: "Citrix",      src: "https://k6.io/static/citrix-4b63b90f22c5e8bf12e9b568aeb52a51.svg" },
  { name: "Microsoft",   src: "https://k6.io/static/microsoft-78dd4a41b7bc3af7ebec21b1093da07b.svg" },
  { name: "Yum! Brands", src: "https://k6.io/static/yum-e3693c4fc2cbcc677a0fbe9f5c55e689.svg" },
  { name: "GitLab",      src: "https://k6.io/static/gitlab-4efdbb1df4fbce23b88b616a4296d2d2.svg" },
  { name: "Carvana",     src: "https://k6.io/static/carvana-4678a6323dc843e68faa8baea7cb78ac.svg" },
];

function Logos({ s }) {
  return (
    <section className="logos">
      <div className="container logos-inner">
        <span className="logos-label">{s.logos.label}</span>
        <div className="logos-row">
          {LOGOS.map((l) => (
            <img
              key={l.name}
              className="logo-item"
              src={l.src}
              alt={l.name}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Process ────────── */

function Process({ s }) {
  return (
    <section className="section" id="process">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{s.process.eyebrow}</span>
          <h2 className="h-section">
            <Highlight text={s.process.title} italic={s.process.titleItalic} />
          </h2>
        </div>
        <div className="process">
          {s.process.steps.map((st) => (
            <div key={st.n} className="step">
              <span className="step-num">{st.n} /04</span>
              <div className="step-title">{st.title}</div>
              <p className="step-body">{st.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Services ────────── */

function Services({ s }) {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{s.services.eyebrow}</span>
          <h2 className="h-section">
            <Highlight text={s.services.title} italic={s.services.titleItalic} />
          </h2>
        </div>
        <div className="services">
          {s.services.items.map((it, i) => {
            const featured = i === 1;
            return (
              <article key={it.title} className={"service" + (featured ? " is-featured" : "")}>
                {featured && <span className="service-pill">{s.services.pillTop}</span>}
                <div className="service-tagline">{it.tagline}</div>
                <h3 className="service-title">{it.title}</h3>
                <div className="service-price">{s.services.price}</div>
                <ul>
                  {it.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <a href="#contact" className="btn btn-ghost service-cta">
                  {it.cta} <span className="btn-arrow"></span>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────── Infrastructure ────────── */

function InfraCard({ kind, data }) {
  return (
    <article className={"infra-card infra-" + kind}>
      <div className="infra-card-head">
        <span className="infra-kind">{data.kind}</span>
        <span className="infra-spec">{data.spec}</span>
      </div>
      <div className="infra-value">
        <span className="infra-num">{data.value}</span>
        <span className="infra-unit">{data.unit}</span>
      </div>
      <div className="infra-label">{data.label}</div>
      <div className="infra-capacity">{data.capacity}</div>
      <p className="infra-note">{data.note}</p>
      <ul className="infra-bullets">
        {data.bullets.map((b) => <li key={b}>{b}</li>)}
      </ul>
    </article>
  );
}

function Infrastructure({ s }) {
  return (
    <section className="section" id="infrastructure">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{s.infra.eyebrow}</span>
          <div>
            <h2 className="h-section">
              <Highlight text={s.infra.title} italic={s.infra.titleItalic} />
            </h2>
            <p className="lead" style={{ marginTop: 18 }}>{s.infra.sub}</p>
          </div>
        </div>
        <div className="infra-grid">
          <InfraCard kind="local" data={s.infra.local} />
          <InfraCard kind="cloud" data={s.infra.cloud} />
        </div>
      </div>
    </section>
  );
}

/* ────────── Calculator ────────── */

function recommendKey(users) {
  if (users < 50_000)    return "smoke";
  if (users < 1_500_000) return "launch";
  return "retain";
}

function Calculator({ s }) {
  const MIN = 1_000;
  const MAX = 50_000_000;
  const [pos, setPos] = useState(56);

  const users = useMemo(() => {
    const t = pos / 100;
    const v = Math.exp(Math.log(MIN) + (Math.log(MAX) - Math.log(MIN)) * t);
    return Math.round(v);
  }, [pos]);

  const peakRps = Math.round((users * 0.05 * 8) / 60);
  const monthlyRequests = users * 240;

  const rec = s.calc.rec[recommendKey(users)];

  return (
    <section className="section" id="calculator">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{s.calc.eyebrow}</span>
          <h2 className="h-section">
            <Highlight text={s.calc.title} italic={s.calc.titleItalic} />
          </h2>
        </div>
        <div className="calc">
          <div className="calc-left">
            <div className="calc-q">{s.calc.q}</div>
            <div className="calc-value">
              <span className="tnum">{formatNumber(users)}</span>
              <span className="scale">{s.calc.perMonth}</span>
            </div>
            <div className="calc-help">{s.calc.help}</div>
            <div className="calc-slider-wrap">
              <input
                type="range"
                className="calc-slider"
                min="0" max="100" step="0.5"
                value={pos}
                onChange={(e) => setPos(parseFloat(e.target.value))}
                aria-label={s.calc.q}
              />
              <div className="calc-ticks">
                <span>1k</span><span>10k</span><span>100k</span>
                <span>1M</span><span>10M</span><span>50M</span>
              </div>
            </div>
          </div>

          <div className="calc-right">
            <div>
              <div className="calc-result-eyebrow">{s.calc.recEyebrow}</div>
              <div className="calc-rec">
                <em>{rec.name}</em>
              </div>
              <div className="calc-help mono" style={{ marginTop: 4, fontSize: 12 }}>
                {rec.meta}
              </div>
            </div>
            <div className="calc-meta-row">
              <div>
                <div className="k">{s.calc.peakRps}</div>
                <div className="v">{formatNumber(peakRps)} / s</div>
              </div>
              <div>
                <div className="k">{s.calc.monthlyReq}</div>
                <div className="v">{formatNumber(monthlyRequests)}</div>
              </div>
            </div>
            <a href="#contact" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              {s.calc.cta} <span className="btn-arrow"></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── Testimonials ────────── */

function Testimonials({ s }) {
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{s.testimonials.eyebrow}</span>
          <h2 className="h-section">
            <Highlight text={s.testimonials.title} italic={s.testimonials.titleItalic} />
          </h2>
        </div>
        <div className="testimonials">
          {s.testimonials.items.map((q) => (
            <figure key={q.name} className="testimonial">
              <blockquote className="testimonial-quote">{q.q}</blockquote>
              <figcaption className="testimonial-author">
                <span className="avatar">{q.initials}</span>
                <div className="testimonial-meta">
                  <div className="name">{q.name}</div>
                  <div className="role">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── About ────────── */

function About({ s }) {
  const [p1a, p1b, p1c, p1d, p1e] = s.about.p1;
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{s.about.eyebrow}</span>
          <h2 className="h-section">
            <Highlight text={s.about.title} italic={s.about.titleItalic} />
          </h2>
        </div>
        <div className="about-grid">
          <div className="about-portrait" aria-hidden="true">
            <span className="ph">{s.about.portrait}</span>
          </div>
          <div className="about-body">
            <p>
              {p1a}<strong>{p1b}</strong>{p1c}<strong>{p1d}</strong>{p1e}
            </p>
            <p>{s.about.p2}</p>
            <p>{s.about.p3}</p>
            <div className="stats">
              {s.about.stats.map((st) => (
                <div className="stat" key={st.lbl}>
                  <div className="num tnum"><em>{st.num}</em></div>
                  <div className="lbl">{st.lbl}</div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 18, fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
              {s.about.footnote}
            </p>
          </div>
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
          BBH · loadtests
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
        <Hero s={s} showRps={t.showRpsCard} />
        <Logos s={s} />
        <Process s={s} />
        <Services s={s} />
        <Infrastructure s={s} />
        {t.showCalculator && <Calculator s={s} />}
        <Testimonials s={s} />
        <About s={s} />
        <Contact s={s} />
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
          options={["#1ea861", "#2a6fdb", "#d97757", "#7a5ae0"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakToggle label="Dark mode" value={t.dark}
          onChange={(v) => setTweak("dark", v)} />

        <TweakSection label="Sections" />
        <TweakToggle label="Show RPS card" value={t.showRpsCard}
          onChange={(v) => setTweak("showRpsCard", v)} />
        <TweakToggle label="Show calculator" value={t.showCalculator}
          onChange={(v) => setTweak("showCalculator", v)} />
      </TweaksPanel>
    </>
  );
}

export { App };

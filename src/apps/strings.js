/* i18n dictionary — Apps showcase · EN + PT-BR */

/* ──────────────────────────────────────────────────────────────
   BuildByHenri products — real. Verify/expand the stacks (Luugo's
   in particular) and statuses as they evolve.
   ────────────────────────────────────────────────────────────── */
const APPS_EN = [
  {
    name: "ALRA",
    status: "live",
    oneLiner: "Your health, at your own pace.",
    desc: "An AI health companion that lives in WhatsApp, Telegram, and an app — logging nutrition, training, sleep, hydration, mood, and habits, with personalized coaching across six wellness pillars.",
    stack: ["FastAPI", "LangGraph", "React Native", "PostgreSQL", "WhatsApp"],
    href: "https://alra.health",
  },
  {
    name: "Luugo",
    status: "live",
    oneLiner: "Buy, sell, and trade — close to you.",
    desc: "A Brazilian marketplace for items, services, places, and vehicles — local classifieds in a clean, modern web app.",
    stack: ["Flutter", "TypeScript", "Go", "MySQL"],
    href: "https://luugo.com.br",
  },
  {
    name: "Stageboard",
    status: "beta",
    oneLiner: "Your band's control panel on stage.",
    desc: "A mobile-first PWA for bands on stage — shared setlists and chord charts that turn the page for everyone in real time, even offline.",
    stack: ["Elixir", "Phoenix LiveView", "PostgreSQL", "Tailwind"],
    href: "https://stageboard.buildbyhenri.com",
  },
];

const APPS_PT = [
  {
    name: "ALRA",
    status: "live",
    oneLiner: "Sua saúde no seu ritmo.",
    desc: "Um companheiro de saúde com IA que vive no WhatsApp, no Telegram e num app — registra nutrição, treino, sono, hidratação, humor e hábitos, com coaching personalizado nos seis pilares do bem-estar.",
    stack: ["FastAPI", "LangGraph", "React Native", "PostgreSQL", "WhatsApp"],
    href: "https://alra.health",
  },
  {
    name: "Luugo",
    status: "live",
    oneLiner: "Compre, venda e troque — pertinho de você.",
    desc: "Um marketplace brasileiro de produtos, serviços, lugares e veículos — classificados locais num app web limpo e moderno.",
    stack: ["Flutter", "TypeScript", "Go", "MySQL"],
    href: "https://luugo.com.br",
  },
  {
    name: "Stageboard",
    status: "beta",
    oneLiner: "O painel de palco da sua banda.",
    desc: "Um PWA mobile-first pra bandas no palco — setlists e cifras compartilhadas que viram a página pra todo mundo em tempo real, mesmo offline.",
    stack: ["Elixir", "Phoenix LiveView", "PostgreSQL", "Tailwind"],
    href: "https://stageboard.buildbyhenri.com",
  },
];

export const STRINGS = {
  en: {
    locale: "en",
    nav: { work: "Work", stack: "Stack", studio: "buildbyhenri.com" },
    hero: {
      tag: "products by buildbyhenri",
      version: "v · 26.q2",
      headline: "Products designed and built by BuildByHenri.",
      headlineItalic: "designed and built",
      sub: "App development isn't a service we sell to clients — these are BuildByHenri's own products, designed, built, and shipped end to end.",
      ctaWork: "See the work",
      note: "designed, built & shipped by BBH",
    },
    builds: { label: "recent builds", foot: "products by buildbyhenri" },
    statusLabels: { live: "Live", beta: "Beta", wip: "WIP" },
    work: {
      eyebrow: "Work",
      title: "Products we've designed and shipped.",
      titleItalic: "designed and shipped.",
      visit: "Open",
    },
    stack: {
      label: "Built with",
      items: ["TypeScript", "React Native", "Flutter", "Go", "Python", "FastAPI", "Elixir", "Phoenix LiveView", "PostgreSQL", "MySQL"],
    },
    footer: { tag: "Built in Brazil, used worldwide" },
    apps: APPS_EN,
  },

  pt: {
    locale: "pt-BR",
    nav: { work: "Projetos", stack: "Stack", studio: "buildbyhenri.com" },
    hero: {
      tag: "produtos da buildbyhenri",
      version: "v · 26.t2",
      headline: "Produtos desenhados e construídos pela BuildByHenri.",
      headlineItalic: "desenhados e construídos",
      sub: "Desenvolvimento de app não é um serviço que a gente vende pra cliente — esses são os produtos da própria BuildByHenri, desenhados, construídos e lançados de ponta a ponta.",
      ctaWork: "Ver os projetos",
      note: "desenhado, construído e lançado pela BBH",
    },
    builds: { label: "builds recentes", foot: "produtos da buildbyhenri" },
    statusLabels: { live: "No ar", beta: "Beta", wip: "Em dev" },
    work: {
      eyebrow: "Projetos",
      title: "Produtos que a gente desenhou e lançou.",
      titleItalic: "desenhou e lançou.",
      visit: "Abrir",
    },
    stack: {
      label: "Feito com",
      items: ["TypeScript", "React Native", "Flutter", "Go", "Python", "FastAPI", "Elixir", "Phoenix LiveView", "PostgreSQL", "MySQL"],
    },
    footer: { tag: "Feito no Brasil, usado no mundo todo" },
    apps: APPS_PT,
  },
};

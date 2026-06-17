/* i18n dictionary — Apps showcase · EN + PT-BR */

/* ──────────────────────────────────────────────────────────────
   PLACEHOLDER apps — swap these for the real BBH products + real
   live/store URLs (and screenshots in .app-thumb) later. Every
   href is "#" on purpose for now.
   ────────────────────────────────────────────────────────────── */
const APPS_EN = [
  {
    name: "Lumo",
    status: "live",
    oneLiner: "Personal finance that actually sticks.",
    desc: "A budgeting app that turns messy bank feeds into one calm weekly number — built to be opened in ten seconds, not studied.",
    stack: ["React Native", "Expo", "TypeScript", "Supabase"],
    href: "#",
  },
  {
    name: "Cadence",
    status: "beta",
    oneLiner: "Habits that survive a bad week.",
    desc: "A routine tracker that bends instead of breaking when life gets in the way — streaks you don't end up resenting.",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    href: "#",
  },
  {
    name: "Forkful",
    status: "live",
    oneLiner: "Dinner, decided.",
    desc: "Recipes and meal planning for people who cook for real — pantry-aware, shopping-list-first, zero life-story preamble.",
    stack: ["React Native", "Expo", "tRPC"],
    href: "#",
  },
  {
    name: "Tonal",
    status: "wip",
    oneLiner: "A practice room in your browser.",
    desc: "An ear-training and practice tool for musicians on the Web Audio API — metronome, drills, and progress that stays honest.",
    stack: ["Next.js", "Web Audio", "Tailwind"],
    href: "#",
  },
];

const APPS_PT = [
  {
    name: "Lumo",
    status: "live",
    oneLiner: "Finança pessoal que gruda de verdade.",
    desc: "App de orçamento que transforma extrato bagunçado num número semanal tranquilo — feito pra abrir em dez segundos, não pra estudar.",
    stack: ["React Native", "Expo", "TypeScript", "Supabase"],
    href: "#",
  },
  {
    name: "Cadence",
    status: "beta",
    oneLiner: "Hábito que sobrevive a uma semana ruim.",
    desc: "Tracker de rotina que dobra em vez de quebrar quando a vida atravessa — streak que você não passa a odiar.",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    href: "#",
  },
  {
    name: "Forkful",
    status: "live",
    oneLiner: "Jantar, resolvido.",
    desc: "Receitas e planejamento de refeição pra quem cozinha de verdade — sabe o que tem na despensa, começa pela lista de compras, sem textão.",
    stack: ["React Native", "Expo", "tRPC"],
    href: "#",
  },
  {
    name: "Tonal",
    status: "wip",
    oneLiner: "Uma sala de ensaio no navegador.",
    desc: "Ferramenta de treino auditivo e prática pra músicos, em cima da Web Audio API — metrônomo, exercícios e progresso honesto.",
    stack: ["Next.js", "Web Audio", "Tailwind"],
    href: "#",
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
      items: ["Next.js", "React Native", "Expo", "TypeScript", "tRPC", "PostgreSQL", "Supabase", "Tailwind"],
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
      items: ["Next.js", "React Native", "Expo", "TypeScript", "tRPC", "PostgreSQL", "Supabase", "Tailwind"],
    },
    footer: { tag: "Feito no Brasil, usado no mundo todo" },
    apps: APPS_PT,
  },
};

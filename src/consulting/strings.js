/* i18n dictionary — Dev Consulting (portfolio) · EN + PT-BR */

/* ──────────────────────────────────────────────────────────────
   Companies / engagements — pulled from Henri's LinkedIn history.
   VERIFY & EDIT: roles, periods and especially "sector" are a
   best-effort read; add real links (href) and any outcomes you
   want to highlight. Every href is "#" for now.
   ────────────────────────────────────────────────────────────── */
const COMPANIES_EN = [
  {
    name: "Conta",
    role: "Systems & DB Administrator · contract",
    period: "2016 — present",
    sector: "Tech · Norway",
    did: "Long-running contract owning systems and database administration for the Greater Stavanger region.",
    href: "#",
  },
  {
    name: "WiQuadro",
    role: "Consulting CTO",
    period: "2015 — present",
    sector: "Edtech · BR",
    did: "Outside CTO: architecture, technical direction, and steering the software team and its products.",
    href: "#",
  },
  {
    name: "WiLivro",
    role: "Technical Lead",
    period: "2012 — 2016",
    sector: "Edtech · BR",
    did: "Led software development for an education-technology product.",
    href: "#",
  },
  {
    name: "MaisQuestões",
    role: "Co-founder",
    period: "2012 — 2016",
    sector: "Edtech · BR",
    did: "Co-founded a study platform built around a database of exam questions, shipped on iOS and Android.",
    href: "#",
  },
  {
    name: "Gesttec",
    role: "Project Manager",
    period: "2009 — 2012",
    sector: "Software · BR",
    did: "Architected and maintained several software systems across a broad stack.",
    href: "#",
  },
  {
    name: "IDK Technologies",
    role: "Software Support",
    period: "2005",
    sector: "Software · BR",
    did: "Software support and troubleshooting.",
    href: "#",
  },
];

const COMPANIES_PT = [
  {
    name: "Conta",
    role: "Admin de Sistemas e Banco · contrato",
    period: "2016 — atual",
    sector: "Tech · Noruega",
    did: "Contrato de longa data cuidando de administração de sistemas e banco de dados na região de Stavanger.",
    href: "#",
  },
  {
    name: "WiQuadro",
    role: "CTO de consultoria",
    period: "2015 — atual",
    sector: "Edtech · BR",
    did: "CTO externo: arquitetura, direção técnica e condução do time de software e dos produtos.",
    href: "#",
  },
  {
    name: "WiLivro",
    role: "Líder Técnico",
    period: "2012 — 2016",
    sector: "Edtech · BR",
    did: "Liderei o desenvolvimento de software de um produto de tecnologia educacional.",
    href: "#",
  },
  {
    name: "MaisQuestões",
    role: "Cofundador",
    period: "2012 — 2016",
    sector: "Edtech · BR",
    did: "Cofundei uma plataforma de estudos baseada num banco de questões de concurso, publicada no iOS e Android.",
    href: "#",
  },
  {
    name: "Gesttec",
    role: "Gerente de Projetos",
    period: "2009 — 2012",
    sector: "Software · BR",
    did: "Arquitetei e mantive vários sistemas de software numa stack bem variada.",
    href: "#",
  },
  {
    name: "IDK Technologies",
    role: "Suporte de Software",
    period: "2005",
    sector: "Software · BR",
    did: "Suporte e troubleshooting de software.",
    href: "#",
  },
];

export const STRINGS = {
  en: {
    locale: "en",
    nav: { work: "Work", contact: "Contact", studio: "buildbyhenri.com" },
    hero: {
      tag: "consulting · portfolio",
      version: "v · 26.q2",
      headline: "The companies I've helped build and steer.",
      headlineItalic: "build and steer.",
      sub: "I don't run consulting as a storefront — this is the work itself: the companies and teams where I've been the technical advisor, CTO, and extra pair of senior hands.",
      ctaWork: "See the work",
      note: "20+ years · Brazil & Norway",
    },
    glance: {
      label: "at a glance",
      items: [
        { k: "Advising since", v: "2005" },
        { k: "Engagements", v: "6 companies" },
        { k: "Across", v: "Brazil · Norway" },
        { k: "Sweet spot", v: "CTO-level advisory" },
      ],
      foot: "20+ years shipping in production",
    },
    work: {
      eyebrow: "Work",
      title: "Where I've done the work.",
      titleItalic: "done the work.",
      visit: "Visit",
    },
    contact: {
      eyebrow: "Get in touch",
      titleA: "Working on something",
      titleItalic: "worth a second opinion?",
      titleB: "Tell me about it.",
      lead: "I take on a small number of advisory engagements at a time. Tell me where you are and I'll reply within a business day — or point you to someone better if I'm not the fit.",
      direct: "Direct",
      fields: {
        name: "Name",
        email: "Email",
        stage: "I need",
        note: "What's the decision or problem?",
        notePh: "e.g. We're about to rewrite our backend in Go and want a second opinion before we commit three months to it.",
      },
      stages: ["Architecture review", "Code audit", "Hiring help", "Second opinion"],
      submit: "Send →",
      sent: "✓ Sent — talk soon",
      sentMsg: "I'll reply within one business day.",
    },
    footer: { tag: "Built in Brazil, advising worldwide" },
    companies: COMPANIES_EN,
  },

  pt: {
    locale: "pt-BR",
    nav: { work: "Trabalho", contact: "Contato", studio: "buildbyhenri.com" },
    hero: {
      tag: "consultoria · portfólio",
      version: "v · 26.t2",
      headline: "As empresas que eu ajudei a construir e conduzir.",
      headlineItalic: "construir e conduzir.",
      sub: "Não toco consultoria como vitrine de venda — isso aqui é o trabalho em si: as empresas e times onde fui o conselheiro técnico, CTO e par de mãos sênior a mais.",
      ctaWork: "Ver o trabalho",
      note: "20+ anos · Brasil e Noruega",
    },
    glance: {
      label: "resumo",
      items: [
        { k: "Consultando desde", v: "2005" },
        { k: "Trabalhos", v: "6 empresas" },
        { k: "Em", v: "Brasil · Noruega" },
        { k: "Forte em", v: "papel de CTO/advisory" },
      ],
      foot: "20+ anos subindo em produção",
    },
    work: {
      eyebrow: "Trabalho",
      title: "Onde eu fiz o trabalho.",
      titleItalic: "fiz o trabalho.",
      visit: "Acessar",
    },
    contact: {
      eyebrow: "Fala comigo",
      titleA: "Tem algo",
      titleItalic: "que merece uma segunda opinião?",
      titleB: "Me conta.",
      lead: "Pego poucos projetos de advisory por vez. Me conta onde você está e respondo em até um dia útil — ou te indico alguém melhor se eu não for o fit.",
      direct: "Direto",
      fields: {
        name: "Nome",
        email: "E-mail",
        stage: "Preciso de",
        note: "Qual é a decisão ou o problema?",
        notePh: "ex.: estamos quase reescrevendo o backend em Go e queríamos uma segunda opinião antes de gastar três meses nisso.",
      },
      stages: ["Revisão de arquitetura", "Auditoria de código", "Ajuda em contratação", "Segunda opinião"],
      submit: "Enviar →",
      sent: "✓ Enviado — até logo",
      sentMsg: "Respondo em até um dia útil.",
    },
    footer: { tag: "Feito no Brasil, consultando o mundo todo" },
    companies: COMPANIES_PT,
  },
};

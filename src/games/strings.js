/* i18n dictionary — Games showcase · EN + PT-BR */

/* ──────────────────────────────────────────────────────────────
   BBH Games — real, live landing pages. Keep platforms and
   statuses in sync with the store listings.
   ────────────────────────────────────────────────────────────── */
const GAMES_EN = [
  {
    name: "Printa",
    status: "live",
    genre: "3D printing tycoon",
    oneLiner: "Turn a gift 3D printer into a real business.",
    desc: "Take orders from classmates, manage the print queue, keep the machines running, and close the month in the black. A cozy tycoon that teaches revenue, expenses, profit, and investment.",
    platforms: ["App Store", "Google Play", "Steam · soon"],
    image: "/games/printa.jpg",
    href: "https://printa.buildbyhenri.com",
  },
  {
    name: "Cidade das Emoções",
    status: "soon",
    genre: "City builder",
    oneLiner: "Build a city where well-being is the profit.",
    desc: "Every building spreads calm, connection, or stress. Start with a school, grow a neighborhood, and reach the whole city — facing the Fog of Apathy and the Storm of Rumors. A city builder inspired by social-emotional learning.",
    platforms: ["App Store · soon", "Google Play · soon"],
    image: "/games/cidadedasemocoes.jpg",
    href: "https://cidadedasemocoes.buildbyhenri.com",
  },
];

const GAMES_PT = [
  {
    name: "Printa",
    status: "live",
    genre: "Tycoon de impressão 3D",
    oneLiner: "Uma impressora 3D de presente vira um negócio de verdade.",
    desc: "Aceite pedidos dos colegas, organize a fila de impressão, cuide das máquinas e feche o mês no azul. Um tycoon aconchegante que ensina receita, despesa, lucro e investimento.",
    platforms: ["App Store", "Google Play", "Steam · em breve"],
    image: "/games/printa.jpg",
    href: "https://printa.buildbyhenri.com",
  },
  {
    name: "Cidade das Emoções",
    status: "soon",
    genre: "Construção de cidades",
    oneLiner: "Construa uma cidade onde o bem-estar é o lucro.",
    desc: "Cada construção espalha calma, conexão ou estresse. Comece pela escola, cresça um bairro e chegue à cidade inteira, enfrentando a Névoa da Apatia e a Tempestade de Rumores. Um jogo inspirado na educação socioemocional.",
    platforms: ["App Store · em breve", "Google Play · em breve"],
    image: "/games/cidadedasemocoes.jpg",
    href: "https://cidadedasemocoes.buildbyhenri.com",
  },
];

export const STRINGS = {
  en: {
    locale: "en",
    nav: { work: "Games", promise: "Promise", studio: "buildbyhenri.com" },
    hero: {
      tag: "games by buildbyhenri",
      version: "v · 26.q4",
      headline: "Cozy games that teach while you play.",
      headlineItalic: "teach while you play.",
      sub: "BBH Games makes small, warm games about real-world skills — running a business, caring for a community. Designed and built in-house.",
      ctaWork: "See the games",
      note: "no ads · no in-app purchases",
    },
    builds: { label: "our games", foot: "games by buildbyhenri" },
    statusLabels: { live: "Live", beta: "Beta", soon: "Coming soon" },
    work: {
      eyebrow: "Games",
      title: "Games we've designed and built.",
      titleItalic: "designed and built.",
      visit: "Play",
    },
    promise: {
      label: "Our promise",
      items: ["No ads", "No in-app purchases", "No data collection"],
    },
    footer: { tag: "Made in Brazil, played worldwide" },
    games: GAMES_EN,
  },

  pt: {
    locale: "pt-BR",
    nav: { work: "Jogos", promise: "Compromisso", studio: "buildbyhenri.com" },
    hero: {
      tag: "jogos da buildbyhenri",
      version: "v · 26.t4",
      headline: "Jogos aconchegantes que ensinam brincando.",
      headlineItalic: "ensinam brincando.",
      sub: "A BBH Games faz jogos pequenos e acolhedores sobre habilidades da vida real — tocar um negócio, cuidar de uma comunidade. Desenhados e construídos em casa.",
      ctaWork: "Ver os jogos",
      note: "sem anúncios · sem compras no app",
    },
    builds: { label: "nossos jogos", foot: "jogos da buildbyhenri" },
    statusLabels: { live: "No ar", beta: "Beta", soon: "Em breve" },
    work: {
      eyebrow: "Jogos",
      title: "Jogos que a gente desenhou e construiu.",
      titleItalic: "desenhou e construiu.",
      visit: "Jogar",
    },
    promise: {
      label: "Nosso compromisso",
      items: ["Sem anúncios", "Sem compras no app", "Sem coleta de dados"],
    },
    footer: { tag: "Feito no Brasil, jogado no mundo todo" },
    games: GAMES_PT,
  },
};

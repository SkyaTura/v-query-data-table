module.exports = {
  locales: {
    "/": {
      lang: "pt-BR",
      title: "Vuetify Query Data Table",
      description: "Documentação para a tabela inteligente com Vueitfy",
    },
  },

  themeConfig: {
    repoLabel: "Contribua!",
    // git repo here... gitlab, github
    repo: "",
    docsDir: "docs",
    editLinks: true,
    docsBranch: "dev",
    editLinkText: "Ajude-nos a aprimorar essa página!",
    search: false,
    locales: {
      "/": {
        label: "Português",
        selectText: "Idiomas",
        lastUpdated: "Última Atualização",
        // service worker is configured but will only register in production
        serviceWorker: {
          updatePopup: {
            message: "Novo conteúdo disponível.",
            buttonText: "Atualizar",
          },
        },
        nav: [
          { text: "Getting Started", link: "/guide" },
          { text: "Components", link: "/components/" },
          // external link to git repo...again
          { text: "GitHub", link: "" },
        ],
        sidebar: {
          "/components/": [
            {
              title: "Componentes",
              collapsable: false,
              children: ["v-query-data-table"],
            },
          ],
        },
      },
    },
  },
};

if (!process.env.I18N_LOCALES) {
  console.error("I18N_LOCALES env is not defined");
  process.exit(1);
}

module.exports = {
  locales: process.env.I18N_LOCALES.split(","),
  defaultLocale: "ru",
  interpolation: { prefix: "{", suffix: "}" },
  loadLocaleFrom: async function (lang, ns) {
    const result = await import(`./public/translations/${lang}/${ns}.json`);
    return result.default;
  },
  pages: {
    "*": ["common"],
    "/": ["home"],
    "/license": ["license"],
    "/terms": ["terms"],
  },
  logBuild: false,
};

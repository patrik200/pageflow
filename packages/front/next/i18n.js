if (!process.env.I18N_LOCALES) {
  console.error("I18N_LOCALES env is not defined");
  process.exit(1);
}

module.exports = function (defaultLocale, loadLocaleFrom, pages) {
  return {
    locales: process.env.I18N_LOCALES.split(","),
    defaultLocale: defaultLocale,
    interpolation: { prefix: "{", suffix: "}" },
    loadLocaleFrom,
    pages,
    logBuild: false,
  };
};

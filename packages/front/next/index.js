require("./patch-favicons");

const path = require("node:path");
const fs = require("node:fs");
const webpack = require("webpack");
const withPlugins = require("next-compose-plugins");
const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");
const DotEnvWebpack = require("dotenv-webpack");
const dotEnv = require("dotenv");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const withTM = require("next-transpile-modules");

const isDev = process.env.NODE_ENV === "development";

module.exports = function ({
  nextTranslateSourceMapsExcludeDirectoriesHack,
  withSentryConfig,
  customPlugins = [],
  addIntl = true,
  addEnv = true,
  envProjectMode,
  rootFolder,
  addSvg = true,
  faviconConfig,
  transpileModules = () => [],
  vanillaExtractExternalPackagesHack = [],
  getLanguagesWhiteList,
}) {
  applyVanillaExtractExternalPackagesHack(vanillaExtractExternalPackagesHack);

  const { localEnv } = addEnv ? module.exports.loadEnvConfigs(envProjectMode, rootFolder) : { localEnv: "" };

  const intlAllLocales = fs.readdirSync(
    path.join(rootFolder, "packages", "front", "frontend", "public", "translations"),
  );

  const languagesWhiteList = getLanguagesWhiteList?.();
  const intlLocales = languagesWhiteList
    ? intlAllLocales.filter((language) => languagesWhiteList.includes(language))
    : intlAllLocales;

  process.env.I18N_LOCALES = intlLocales.join(",");

  const newConfig = withPlugins(
    [
      ...(addIntl ? [require("next-translate-plugin")] : []),
      ...(isDev ? [] : [createVanillaExtractPlugin()]),
      withTM(transpileModules()),
      ...customPlugins,
      function (nextConfig) {
        return {
          ...nextConfig,
          webpack(rawConfig, options) {
            const config =
              typeof nextConfig.webpack === "function" ? nextConfig.webpack(rawConfig, options) : rawConfig;

            applyProgress(config);
            if (addEnv) applyEnvsConfigs(config, localEnv);
            if (addSvg) applySvg(config);
            if (faviconConfig) applyFavicon(config, options.isServer, rootFolder, faviconConfig);
            applySourcemaps(config);
            applyDuplicatesFinder(config);
            applyNextTranslateSourcemapsHack(config, nextTranslateSourceMapsExcludeDirectoriesHack);

            config.plugins.push(
              new webpack.DefinePlugin({ "process.env.I18N_LOCALES": `"${process.env.I18N_LOCALES}"` }),
            );

            return config;
          },
        };
      },
    ],
    {
      productionBrowserSourceMaps: true,
      i18n: { localeDetection: false },
      poweredByHeader: false,
      reactStrictMode: false,
      assetPrefix: undefined,
      experimental: undefined,
      amp: undefined,
    },
  );

  return (phase, { defaultConfig }) => {
    delete defaultConfig.webpackDevMiddleware;
    delete defaultConfig.configOrigin;
    delete defaultConfig.target;
    delete defaultConfig.webpack5;

    const resultConfig = newConfig(phase, { defaultConfig });
    const sentryConfig = getSentryConfig();

    if (sentryConfig && withSentryConfig) {
      resultConfig.sentry = { hideSourceMaps: false };
      return withSentryConfig(resultConfig, sentryConfig);
    }

    return resultConfig;
  };
};

function applyProgress(config) {
  if (isDev) return;
  config.plugins.push(new webpack.ProgressPlugin({ entries: false, modules: true, activeModules: false }));
}

module.exports.loadEnvConfigs = function (projectMode, rootFolder) {
  const localEnv = path.join(rootFolder, ".env");

  dotEnv.config({ path: localEnv });

  return { localEnv };
};

function applyEnvsConfigs(config, localEnv) {
  dotEnv.config({ path: localEnv });
  config.plugins.push(new DotEnvWebpack({ path: localEnv, ignoreStub: true }));
}

function applySvg(config) {
  config.module.rules.unshift({
    test: /\.svg$/,
    loader: require.resolve("@svgr/webpack"),
    options: {
      svgoConfig: {
        plugins: [{ name: "preset-default", params: { overrides: { removeViewBox: false, cleanupIDs: false } } }],
      },
    },
  });
}

function applyFavicon(config, isServer, rootFolder, faviconConfig) {
  if (isServer) return;
  config.plugins.push(
    new FaviconsWebpackPlugin({
      inject: false,
      prefix: "favicon/",
      logo: path.join(rootFolder, "packages", "front", "frontend", "public", "base_favicon.svg"),
      favicons: faviconConfig,
    }),
  );
}

function applySourcemaps(config) {
  config.module.rules.push({
    enforce: "pre",
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    loader: require.resolve("source-map-loader"),
  });

  if (!config.ignoreWarnings) config.ignoreWarnings = [];
  config.ignoreWarnings.push(/Failed to parse source map/);
}

function applyNextTranslateSourcemapsHack(config, nextTranslateSourceMapsExcludeDirectoriesHack) {
  const translateRule = config.module.rules.find((rule) => rule.use?.loader === "next-translate/plugin/loader");
  if (!translateRule) return;
  if (nextTranslateSourceMapsExcludeDirectoriesHack) {
    translateRule.exclude = new RegExp(`(node_modules|${nextTranslateSourceMapsExcludeDirectoriesHack})`);
  } else {
    translateRule.exclude = new RegExp("node_modules");
  }
}

function applyDuplicatesFinder(config) {
  if (process.env.NODE_ENV !== "production") return;
  config.plugins.push(new DuplicatePackageCheckerPlugin());
}

function getSentryConfig() {
  if (process.env.NODE_ENV !== "production") return null;
  if (!process.env.SENTRY_FRONTEND_AUTH_TOKEN || !process.env.SENTRY_DSN || !process.env.SENTRY_ENVIRONMENT)
    return null;

  return { silent: true, authToken: process.env.SENTRY_FRONTEND_AUTH_TOKEN };
}

function applyVanillaExtractExternalPackagesHack(externalPackages) {
  if (isDev) return;

  const vanillaLoaderPath = "@vanilla-extract/webpack-plugin/loader";
  require(vanillaLoaderPath);
  const vanillaLoaderModule = require.cache[require.resolve(vanillaLoaderPath)];
  const originalPitchFunction = vanillaLoaderModule.exports.pitch;
  vanillaLoaderModule.exports.pitch = function () {
    this.query.childCompiler.externals = [...(this.query.childCompiler.externals || []), ...externalPackages];
    return originalPitchFunction.call(this);
  };
}

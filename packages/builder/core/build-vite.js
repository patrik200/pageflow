const { defineConfig } = require("vite");
const path = require("node:path");
const { default: svgrPlugin } = require("vite-plugin-svgr");
const { vanillaExtractPlugin: vanillaExtractVitePlugin } = require("@vanilla-extract/vite-plugin");
const { default: tsconfigPaths } = require("vite-tsconfig-paths");
const { default: swc } = require("rollup-plugin-swc");

const { replaceConditionalBlockPlugin } = require("./replace-conditional-block-plugin");

function getPlugins({ externals, minify }) {
  return [
    tsconfigPaths(),
    svgrPlugin({ svgrOptions: { ref: true } }),
    vanillaExtractVitePlugin({
      esbuildOptions: { externals },
      identifiers: minify ? "short" : "debug",
      emitCssInSsr: true,
    }),
    swc({
      sourceMaps: true,
      rollup: { include: /\.[mc]?[jt]sx?$/ },
      jsc: {
        parser: { syntax: "typescript", tsx: true, dynamicImport: true, decorators: true },
        target: "es2022",
        transform: { decoratorMetadata: true },
      },
    }),
  ];
}

module.exports.buildVite = function ({ externals, minify, entryPoint, defineGlobalAsWindow, formats = ["cjs", "es"] }) {
  if (defineGlobalAsWindow === undefined) throw new Error("defineGlobalAsWindow option is not defined");
  if (!externals) throw new Error("external packages option is not defined");
  const rootPath = process.cwd();

  return defineConfig({
    mode: minify ? "production" : "development",
    define: defineGlobalAsWindow ? { global: "window" } : undefined,
    plugins: [replaceConditionalBlockPlugin(), ...getPlugins({ externals, minify })],
    esbuild: false,
    build: {
      outDir: entryPoint ? path.join(rootPath, "dist", entryPoint.outDirName) : path.join(rootPath, "dist"),
      ssr: true,
      target: "node18",
      minify,
      lib: {
        entry: entryPoint
          ? { [entryPoint.outFileName]: path.resolve(rootPath, "src", entryPoint.path) }
          : { main: path.resolve(rootPath, "src/main.ts") },
        formats,
      },
      rollupOptions: {
        external: [...externals, "*.woff2"],
        output: {
          interop: "auto",
        },
      },
      sourcemap: true,
    },
  });
};

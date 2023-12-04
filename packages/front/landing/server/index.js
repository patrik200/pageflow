const next = require("next");
const express = require("express");
const path = require("node:path");

const isDev = process.env.NODE_ENV === "development";

class RealNextAppSpawner {
  createExpressApp() {
    const app = express();
    app.disable("x-powered-by");
    return app;
  }

  async createNextRequestHandler() {
    const nextApp = next({
      dev: isDev,
      customServer: true,
      dir: process.cwd(),
      port: 3001,
      hostname: "localhost",
    });
    nextApp.server = await nextApp.getServer();
    if (isDev) await nextApp.prepare();
    return nextApp.getRequestHandler();
  }

  async registerNextRouter() {
    const app = this.createExpressApp();
    const handleRequest = await this.createNextRequestHandler();
    const rootPath = path.join(process.cwd(), "..", "..", "..");
    app.use(express.static(path.resolve(rootPath, "node_modules", "@app/ui-kit", "public")));
    app.use("/", (req, res) => handleRequest(req, res));
    app.listen(3001, "0.0.0.0");
    console.log("Listening on http://0.0.0.0:3001");
  }
}

new RealNextAppSpawner().registerNextRouter();

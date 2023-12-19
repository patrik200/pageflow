const next = require("next");
const express = require("express");
const path = require("node:path");
const cors = require("cors");

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
      port: 3000,
      hostname: "localhost",
    });
    nextApp.server = await nextApp.getServer();
    await nextApp.prepare();
    return nextApp.getRequestHandler();
  }

  async registerNextRouter() {
    const app = this.createExpressApp();
    if (isDev) app.use(cors({ origin: ["http://localhost:5173"] }));
    const handleRequest = await this.createNextRequestHandler();
    const rootPath = path.join(process.cwd(), "..", "..", "..");
    app.use(express.static(path.resolve(rootPath, "node_modules", "@app/ui-kit", "public")));
    app.use("/favicon", express.static(path.resolve(process.cwd(), ".next", "favicon")));
    app.use("/", (req, res) => handleRequest(req, res));
    app.listen(3000, "0.0.0.0");
  }
}

new RealNextAppSpawner().registerNextRouter();

import { INestApplication, Logger } from "@nestjs/common";
import { Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";

import { BaseExpressRequest } from "types";

function createFilesMiddleware(uploadDir: string | undefined) {
  const multipart = require("connect-multiparty")({ uploadDir });
  return function (req: BaseExpressRequest<{}>, res: Response, next: Function) {
    res.on("finish", async () => {
      try {
        await Promise.all(Object.values(req.files).map((file) => fs.rm(file!.path)));
      } catch (e) {
        console.error(e);
      }
    });
    return multipart(req, res, next);
  };
}

export async function initializeFiles(app: INestApplication, rootPath: string) {
  const uploadDir = path.join(rootPath, "temp_multiparty");
  try {
    const stats = await fs.stat(uploadDir);
    if (!stats.isDirectory()) {
      Logger.error(`Path ${uploadDir} is not a directory`, "Bootstrap");
      process.exit(1);
    }
  } catch (e) {
    try {
      await fs.mkdir(uploadDir);
    } catch (e) {
      Logger.error(`Directory ${uploadDir} create error`, "Bootstrap");
      Logger.error(e);
      process.exit(1);
    }
  }

  app.use(createFilesMiddleware(uploadDir));
  Logger.log("Files initialized", "Bootstrap");
}

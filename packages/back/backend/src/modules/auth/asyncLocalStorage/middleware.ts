import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

import { AuthUserEntity } from "types/express";

import { currentUserStorage } from "./index";

@Injectable()
export class CurrentUserLocalStorageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    currentUserStorage.run({} as AuthUserEntity, () => next());
  }
}

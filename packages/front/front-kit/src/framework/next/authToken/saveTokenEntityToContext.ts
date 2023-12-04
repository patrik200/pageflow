import { setTokenCookies } from "libs";

import { TokenEntity } from "entities/TokenEntity";

import { ServerSidePropsContext } from "framework/page/types";

export function saveTokenEntityToContext(context: ServerSidePropsContext, tokenEntity: TokenEntity) {
  Object.assign(context.req.cookies, tokenEntity.plainObject);
  setTokenCookies(tokenEntity, context.res);
}

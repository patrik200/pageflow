import { ServerSidePropsContext } from "framework/page/types";
import { PseudoTokenEntity, setTokenCookies } from "libs/server/setTokenCookies";

export function removeTokenFromContext(context: ServerSidePropsContext) {
  const tokenEntity: PseudoTokenEntity = { token: "", refreshToken: "" };
  Object.assign(context.req.cookies, tokenEntity);
  setTokenCookies(tokenEntity, context.res);
}

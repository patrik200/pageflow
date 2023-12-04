import type { Response } from "express";
import { DateTime } from "luxon";

export interface PseudoTokenEntity {
  token: string;
  refreshToken: string;
}

export function setTokenCookies(tokenEntity: PseudoTokenEntity, res: Response) {
  const expiresTime = setAnyTokenCookie("token", tokenEntity.token, res, { httpOnly: true });
  setAnyTokenCookie("refresh_token", tokenEntity.refreshToken, res, { expiresTime, httpOnly: true });
  const tokenProxy = tokenEntity.token.split(".")[1];
  setAnyTokenCookie("token_proxy", tokenProxy ? `.${tokenProxy}.` : "", res, { expiresTime, httpOnly: false });
  return expiresTime;
}

export function setAnyTokenCookie(
  cookieName: string,
  value: string,
  res: Response,
  { expiresTime, httpOnly }: { expiresTime?: Date; httpOnly: boolean },
) {
  let expires = expiresTime;
  if (!expires) expires = DateTime.local().plus({ year: 1 }).toJSDate();
  res.cookie(cookieName, value, { expires, httpOnly, secure: false });
  return expires;
}

export function syncTokenAndTokenProxy(cookies: Record<string, string>, res: Response) {
  if (!cookies.token) return;
  const tokenPayload = cookies.token.split(".")[1];
  const tokenProxy = `.${tokenPayload}.`;
  if (cookies.token_proxy === tokenProxy) return;
  setAnyTokenCookie("token_proxy", tokenProxy, res, { httpOnly: false });
}

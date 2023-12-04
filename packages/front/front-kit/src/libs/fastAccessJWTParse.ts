import { isNumber, isString } from "@worksolutions/utils";

export function fastAccessJWTParse(token: string) {
  try {
    const [, signedBase64Payload] = token.split(".");
    if (!signedBase64Payload) return null;
    const [payload] = atob(signedBase64Payload).split(".");
    if (!payload) return null;
    const parsed = JSON.parse(atob(payload));
    if (!isNumber(parsed.exp) || !isNumber(parsed.iat) || !isString(parsed.userId)) return null;
    if (parsed.exp <= 0 || parsed.iat <= 0) return null;
    return { expirationAt: parsed.exp, createdAt: parsed.iat, userId: parsed.userId };
  } catch (e) {
    return null;
  }
}

import type { IncomingHttpHeaders } from "node:http";

export interface GetIpConfig {
  headers: IncomingHttpHeaders;
  socket: { remoteAddress?: string };
}

export class IPDetector {
  validateIp(ip: string) {
    const regExp =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    return regExp.test(ip);
  }

  getIp(req: GetIpConfig) {
    const xRealIp = ((req.headers["x-real-ip"] || "") as string).split(",")[0];
    if (xRealIp && this.validateIp(xRealIp)) return xRealIp;
    const xForwardedFor = ((req.headers["x-forwarded-for"] || "") as string).split(",")[0];
    if (xForwardedFor && this.validateIp(xForwardedFor)) return xForwardedFor;
    const { remoteAddress } = req.socket;
    if (!remoteAddress || !this.validateIp(remoteAddress)) return null;
    return remoteAddress;
  }
}

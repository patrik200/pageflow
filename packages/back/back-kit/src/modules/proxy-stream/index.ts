import http, { RequestOptions } from "node:http";
import https from "node:https";
import { Response } from "express";

import { BaseExpressRequest } from "types";

export type ProxyStreamProtocol = "http:" | "https:";

export class ProxyStream {
  constructor(
    private hostOptions: { hostname: string; port?: number; protocol: ProxyStreamProtocol },
    private options: {
      timeout?: number;
      modifyPath?: (path: string) => string;
      modifyHeaders?: (headers: Record<string, string>) => Record<string, string>;
    } = {},
  ) {}

  private mergeHeadersFromRequest(req: BaseExpressRequest<{}>) {
    return Object.assign({ "original-host": req.headers.host }, req.headers, {
      connection: null,
      host: null,
    }) as Record<string, string>;
  }

  private getRequest(protocol: ProxyStreamProtocol) {
    return protocol === "https:" ? https.request : http.request;
  }

  createRequest(req: BaseExpressRequest<{}>, res: Response, onError: (e: Error) => void) {
    const newPath = req.baseUrl + req.url;
    const newHeaders = this.mergeHeadersFromRequest(req);
    const requestOptions: RequestOptions = {
      method: req.method,
      hostname: this.hostOptions.hostname,
      port: this.hostOptions.port,
      path: this.options.modifyPath?.(newPath) ?? newPath,
      timeout: this.options.timeout ?? MAX_TIMEOUT,
      headers: this.options.modifyHeaders?.(newHeaders) ?? newHeaders,
    };
    const resultStream = req.pipe(this.getRequest(this.hostOptions.protocol)(requestOptions), { end: true });
    resultStream.once("error", onError);
    resultStream.once("timeout", () => resultStream.destroy(new Error("Request timeout")));
    resultStream.once("response", (result) => {
      if (result.statusCode) res.writeHead(result.statusCode, result.headers);
      result.on("data", (chunk) => res.write(chunk));
      result.on("end", () => res.end());
    });
  }
}

const MAX_TIMEOUT = 30_000;

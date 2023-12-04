import { createAxiosAdapter, RequestManager } from "@app/kit";

import { getVariable } from "bootstrap/variables";

function getBackendHost() {
  return `http://${getVariable("nestHost")}:${getVariable("nestPort")}`;
}

export function createRequestManagerBaseUrl(baseURL: string) {
  if (typeof window !== "undefined") {
    if (process.env.NODE_ENV === "development") return getBackendHost() + baseURL;
    return baseURL;
  }

  if (baseURL.startsWith("http")) return baseURL;
  return getBackendHost() + baseURL;
}

const axiosAdapter = createAxiosAdapter(createRequestManagerBaseUrl);

export function createRequestManager(baseUrl: string, CustomRequestManager: typeof RequestManager) {
  return new CustomRequestManager(baseUrl, { axiosAdapter });
}

export class InternalRequestManager extends RequestManager {}
export function createInternalRequestManager() {
  return createRequestManager("/api", InternalRequestManager);
}

import { AxiosRequestConfig } from "axios";

export function setCookiesToAxiosConfig(config: AxiosRequestConfig, cookies: Record<string, string>) {
  if (!config.headers) config.headers = {};
  if (!config.headers.cookie) config.headers.cookie = "";
  if (config.headers.cookie !== "") config.headers.cookie += "; ";

  config.headers.cookie += Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

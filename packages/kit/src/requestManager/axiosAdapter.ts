// @ts-ignore
import { AxiosRequestConfig, defaults } from "axios";

export function createAxiosAdapter(getBaseUrl: (baseUrl: string) => string) {
  return function (axiosConfig: AxiosRequestConfig) {
    return defaults.adapter({ ...axiosConfig, baseURL: getBaseUrl(axiosConfig.baseURL || "") });
  };
}

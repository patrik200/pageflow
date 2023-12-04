import { RequestManager } from "@app/kit";
import { ContainerInstance } from "typedi";

import { getVariable } from "bootstrap/variables";

export function prepareRequestManagerToSendAcceptLanguage(
  container: ContainerInstance,
  requestManager: RequestManager,
) {
  requestManager.beforeRequestMiddleware.push(({ config }) => {
    const acceptLanguage = getVariable("getAcceptLanguage")(container);
    if (acceptLanguage) config.headers!["Accept-Language"] = acceptLanguage;
  });
}

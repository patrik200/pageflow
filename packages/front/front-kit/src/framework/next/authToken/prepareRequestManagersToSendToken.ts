import { AxiosRequestConfig } from "axios";
import { RequestManager } from "@app/kit";

import { PseudoTokenEntity } from "libs";

import { setCookiesToAxiosConfig } from "../axiosConfigCookies/setCookiesToAxiosConfig";

export function prepareRequestManagersToSendToken(
  { token, refreshToken }: PseudoTokenEntity,
  requestManagers: RequestManager[],
) {
  function middleware({ config }: { config: AxiosRequestConfig }) {
    setCookiesToAxiosConfig(config, { token, refresh_token: refreshToken });
  }

  requestManagers.forEach((requestManager) => requestManager.beforeRequestMiddleware.push(middleware));

  return function rollback() {
    requestManagers.forEach((requestManager) => {
      const index = requestManager.beforeRequestMiddleware.indexOf(middleware);
      if (index === -1) return;
      requestManager.beforeRequestMiddleware.splice(index, 1);
    });
  };
}

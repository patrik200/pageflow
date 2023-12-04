import { ContainerInstance } from "typedi";
import { getAllRequestManagers } from "@app/front-kit";

import { ProfileStorage } from "core/storages/profile/profile";

export function handleTokenBrowser(container: ContainerInstance) {
  const requestManagers = getAllRequestManagers(container);
  const profileStorage = container.get(ProfileStorage);

  requestManagers.forEach((manager) => {
    manager.beforeRequestMiddleware.push(({ config }) => {
      config.withCredentials = true;
    });

    manager.errorMiddleware.push(async ({ error, makeRequest }) => {
      if (error.data.statusCode !== 401) return error;
      try {
        await profileStorage.refreshToken();
        const result = await makeRequest({ disableErrorMiddlewares: true });
        if (result[1]) return error;
        return result[0];
      } catch (e) {
        return error;
      }
    });
  });
}

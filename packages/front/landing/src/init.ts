import { bootstrap } from "@app/front-kit";

import _optimizer from "./optimizer";
import { ProfileStorage } from "./core/storages/profile/profile";

if (typeof window === "undefined") {
  require("internal/node");
}

// HACK for force import
// @ts-ignore
global._optimizer = _optimizer;

bootstrap({
  nestPort: 8000,
  nestHost: "",
  customRequestManagers: new Map([]),
  globalContainerInstancesSetter: (containerInstance, resolve) => {
    containerInstance.set(ProfileStorage, resolve(ProfileStorage));
  },
  getAcceptLanguage: (container) => container.get(ProfileStorage).acceptLanguage,
  setAcceptLanguage: (acceptLanguage, container) => container.get(ProfileStorage).setAcceptLanguage(acceptLanguage),
});

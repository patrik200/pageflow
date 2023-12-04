import { bootstrap } from "@app/front-kit";

import _icons from "icons";

import _optimizer from "./optimizer";
import { IntlDateStorage } from "./core/storages/intl-date";
import { ProfileStorage } from "./core/storages/profile/profile";
import { ClientCommonStorage } from "./core/storages/client/client-common";
import { AllUsersStorage } from "./core/storages/profile/allUsers";
import { DictionariesCommonStorage } from "./core/storages/dictionary/common";

if (typeof window === "undefined") {
  require("internal/node");
} else {
  require("internal/browser");
}

// HACK for force import
// @ts-ignore
global._optimizer = _optimizer;

// HACK for force import
// @ts-ignore
global._icons = _icons;

bootstrap({
  nestPort: 8000,
  nestHost: process.env.NEST_HOST!,
  customRequestManagers: new Map([]),
  globalContainerInstancesSetter: (containerInstance, resolve) => {
    containerInstance.set(IntlDateStorage, resolve(IntlDateStorage));
    containerInstance.set(ProfileStorage, resolve(ProfileStorage));
    containerInstance.set(AllUsersStorage, resolve(AllUsersStorage));
    containerInstance.set(ClientCommonStorage, resolve(ClientCommonStorage));
    containerInstance.set(DictionariesCommonStorage, resolve(DictionariesCommonStorage));
  },
  getAcceptLanguage: (container) => container.get(ProfileStorage).acceptLanguage,
  setAcceptLanguage: (acceptLanguage, container) => container.get(ProfileStorage).setAcceptLanguage(acceptLanguage),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default null;

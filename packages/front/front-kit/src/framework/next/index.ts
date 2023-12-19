import { globalBrowserInitializer, globalInternalPageDataLoader } from "framework/page/serverSideProps";

import { initializeAcceptLanguage, initializeAcceptLanguageByContext } from "./acceptLanguage";
import { initializeSendRequestHeadersToRequestManager } from "./headers";

if (typeof window === "undefined") {
  globalInternalPageDataLoader.set("initial logic", async function (context, container) {
    initializeAcceptLanguageByContext(context, container);
    initializeSendRequestHeadersToRequestManager(context, container);
    return [];
  });
}

export function runBrowserInitializers() {
  if (typeof window === "undefined") return;
  globalBrowserInitializer.set("__framework_rm", function (container) {
    initializeAcceptLanguage(container);
  });
}

export { createScopedContainer } from "./scopedContainer/createScopedContainer";
export { setCookiesToAxiosConfig } from "./axiosConfigCookies/setCookiesToAxiosConfig";
export * from "./authToken";

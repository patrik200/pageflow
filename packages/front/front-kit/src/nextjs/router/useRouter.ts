import React from "react";
import { useSyncToRef } from "@worksolutions/react-utils";
import { useRouter as useNextRouter } from "next/router";
import { isString, isNil } from "@worksolutions/utils";

import { getLanguageUrl } from "libs/server/getLanguageUrl";

type NextRouter = ReturnType<typeof useNextRouter>;

type OriginalPush = NextRouter["push"];
export type RouterPatchedPush = React.MutableRefObject<
  (url: Parameters<OriginalPush>[0], options?: Parameters<OriginalPush>[2]) => Promise<boolean>
>;

export type RouterInterface = Omit<
  NextRouter,
  "push" | "reload" | "replace" | "defaultLocale" | "locale" | "locales"
> & {
  push: RouterPatchedPush;
  replace: RouterPatchedPush;
  reload: React.MutableRefObject<NextRouter["reload"]>;
  defaultLocale: string;
  locale: string;
  locales: string[];
};

export function useRouter(): RouterInterface {
  const router = useNextRouter();
  const pushRef = useRouterPatcherMethod(router, "push");
  const replaceRef = useRouterPatcherMethod(router, "replace");

  return {
    ...router,
    defaultLocale: router.defaultLocale as string,
    locale: router.locale as string,
    locales: router.locales as string[],
    push: pushRef,
    replace: replaceRef,
    reload: useSyncToRef(router.reload),
  };
}

function useRouterPatcherMethod(router: NextRouter, name: "push" | "replace"): RouterPatchedPush {
  const method = useSyncToRef(router[name]);
  const patchedMethod = React.useCallback(
    (url: Parameters<OriginalPush>[0], options?: Parameters<OriginalPush>[2]) => {
      if (isString(url)) return method.current(url, undefined, options);
      return method.current(
        { ...url, query: Object.fromEntries(Object.entries(url.query || {}).filter(([, value]) => !isNil(value))) },
        undefined,
        options,
      );
    },
    [method],
  );
  return useSyncToRef(patchedMethod);
}

export function useRouterNativePush() {
  const { locale, defaultLocale } = useRouter();
  const handler = React.useCallback(
    (url: string) => {
      window.location.href = getLanguageUrl(locale, defaultLocale!) + (url.startsWith("/") ? url.slice(1) : url);
    },
    [defaultLocale, locale],
  );

  return useSyncToRef(handler);
}

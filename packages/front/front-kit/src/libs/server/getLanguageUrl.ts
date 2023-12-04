import nextCookies from "next-cookies";

import { ServerSidePropsContext } from "framework/page";

export function getLanguageUrl(language: string | undefined, defaultLanguage: string) {
  return language === defaultLanguage ? "/" : `/${language}/`;
}

export function getLanguageUrlByNextContext(context: ServerSidePropsContext) {
  const { NEXT_LOCALE } = nextCookies(context);
  return getLanguageUrl(NEXT_LOCALE || context.locale, context.defaultLocale!);
}

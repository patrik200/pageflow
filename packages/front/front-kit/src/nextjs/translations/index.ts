import React from "react";
import { useEffectSkipFirst } from "@worksolutions/react-utils";
import { isDeepEqual, isString } from "@worksolutions/utils";
import { usePrevious } from "react-use";
import { InternalContext } from "next-translate/I18nProvider";
import nextUseTranslation from "next-translate/useTranslation";
import type { TranslationQuery } from "next-translate";

export type TranslationKey = { scope: string; place?: string; name: string; parameter?: string } | string;

export function createTranslationKey(translationKey: TranslationKey) {
  if (isString(translationKey)) return translationKey;

  const { scope, name, place, parameter } = translationKey;
  let key = scope;
  if (place) key += "." + place;
  key += "." + name;
  if (parameter) key += "." + parameter;
  return key;
}

export function useTranslation(defaultNs = "common") {
  const nextTranslateContext = React.useContext(InternalContext);
  const nextTranslation = nextUseTranslation(defaultNs);
  const [translationState, setTranslationState] = React.useState(nextTranslation);
  const previousNs = usePrevious(nextTranslateContext.ns);
  const translationsToggleKeys = React.useContext(translationToggleKeysContext);

  useEffectSkipFirst(() => {
    if (nextTranslateContext.ns === previousNs || isDeepEqual(nextTranslateContext.ns, previousNs)) return;
    setTranslationState(nextTranslation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextTranslateContext.ns, previousNs]);

  useEffectSkipFirst(() => {
    setTranslationState(nextTranslation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextTranslation.lang]);

  const translate = translationState.t;

  const t = React.useCallback(
    (translationKey: TranslationKey, translationQuery?: TranslationQuery) => {
      const key = createTranslationKey(translationKey);
      if (translationsToggleKeys) return defaultNs + ":" + key;
      return translate(key, translationQuery) as string;
    },
    [defaultNs, translate, translationsToggleKeys],
  );

  return { t, language: translationState.lang };
}

export type TranslationFunction = ReturnType<typeof useTranslation>["t"];

export const translationToggleKeysContext = React.createContext(false);

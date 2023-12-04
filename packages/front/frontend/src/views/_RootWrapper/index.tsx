import React from "react";
import Head from "next/head";
import { observer } from "mobx-react-lite";
import { AvailableCalendarLanguages, CustomProvider, globalThemeColorVars, ModalContextInterface } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import { useEventEmitter } from "@worksolutions/react-utils";
import { without } from "@worksolutions/utils";

import { globalEventBus } from "core/eventBus";

import { IntlDateStorage } from "core/storages/intl-date";

import { useTokenAutoUpdater } from "./libs/tokenAutoUpdater";
import { useTokenForceRefreshGlobalEvent } from "./libs/tokenForceRefresh";
import { useLoadClientNotifications } from "./libs/clientNotificationsLoader";

interface RootWrapperInterface {
  children: React.ReactNode;
}

export function getRootElement() {
  return typeof window === "undefined" ? null! : document.getElementById("root")!;
}

function RootWrapper({ children }: RootWrapperInterface) {
  const { language } = useTranslation();

  const rootContainerModalProviderModal = useRootContainerModalProvider();
  useTokenAutoUpdater();
  useTokenForceRefreshGlobalEvent();
  useLoadClientNotifications();

  return (
    <>
      <Head>
        <meta
          key={0}
          name="viewport"
          content="viewport-fit=cover, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0"
        />
        <meta key={1} name="theme-color" content={globalThemeColorVars.primary} />
      </Head>
      <CustomProvider
        modal={rootContainerModalProviderModal}
        scrollProvider={{ scrollableElement: global.window, wrapperElement: global.window }}
        calendar={{
          language: language as AvailableCalendarLanguages,
          intlDate: IntlDateStorage.createIntlDate(language),
        }}
      >
        {children}
      </CustomProvider>
    </>
  );
}

export default observer(RootWrapper);

export function useRootContainerModalProvider() {
  const [ignoreClickOutsideElements, setIgnoreClickOutsideElements] = React.useState<HTMLElement[]>([]);

  useEventEmitter(
    globalEventBus,
    "ADD_MODAL_IGNORE_CLICK_OUTSIDE_ELEMENT",
    React.useCallback(
      (element: HTMLElement) => setIgnoreClickOutsideElements((elements) => [...elements, element]),
      [],
    ),
  );

  useEventEmitter(
    globalEventBus,
    "REMOVE_MODAL_IGNORE_CLICK_OUTSIDE_ELEMENT",
    React.useCallback(
      (element: HTMLElement) => setIgnoreClickOutsideElements((elements) => without([element], elements)),
      [],
    ),
  );

  return React.useMemo<ModalContextInterface>(
    () => ({ rootElement: getRootElement(), ignoreClickOutsideElements }),
    [ignoreClickOutsideElements],
  );
}

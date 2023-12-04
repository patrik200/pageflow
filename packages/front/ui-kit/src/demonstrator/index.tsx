import React from "react";
import { useLocalStorage } from "react-use";
import cn from "classnames";
import { IntlDate } from "@worksolutions/utils";

import Provider from "primitives/Provider";

import "./blocks";
import { europeDateFormats } from "./blocks/calendar/dateFormats";
import { demoComponents } from "./registrar";
import LeftMenu from "./components/LeftMenu";

import { rightBlockStyle, rootWrapperStyle } from "./style.css";

function Root({ className }: { className?: string }) {
  const [active = demoComponents[0].name, setActive] = useLocalStorage<string>("__dev_demonstrator_page");
  const ActiveComponent = demoComponents.find((demo) => demo.name === active)?.Component;

  const [opened = true, setOpened] = useLocalStorage("menuOpened", true);
  const toggleOpened = React.useCallback(() => setOpened(!opened), [opened, setOpened]);

  return (
    <div className={cn(rootWrapperStyle, className)}>
      <LeftMenu active={active} opened={opened} setActive={setActive} toggleOpened={toggleOpened} />
      <div style={opened ? { marginLeft: 24 } : undefined} className={rightBlockStyle}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}

export function RunDemonstrator({ className, rootElement }: { className?: string; rootElement: HTMLElement }) {
  const intlDate = new IntlDate({
    languageCode: "ru",
    matchDateModeAndLuxonTypeLiteral: europeDateFormats,
  });

  return (
    <Provider
      modal={{ rootElement }}
      scrollProvider={{ scrollableElement: window, wrapperElement: window }}
      calendar={{ intlDate, language: "ru" }}
    >
      <Root className={className} />
    </Provider>
  );
}

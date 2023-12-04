import React from "react";

import { ModalContext, ModalContextInterface, RenderedInModalContext } from "./Modal";
import { ScrollProviderContext, ScrollProviderContextInterface } from "./ScrollProvider";
import { CalendarContext, CalendarContextInterface } from "./Calendar/Context";

export interface KitProviderInterface {
  children: React.ReactNode;
  modal: ModalContextInterface;
  scrollProvider: ScrollProviderContextInterface;
  calendar: CalendarContextInterface;
}

function CustomProvider({ children, modal, scrollProvider, calendar }: KitProviderInterface) {
  return (
    <ModalContext.Provider value={modal}>
      <RenderedInModalContext.Provider value={false}>
        <ScrollProviderContext.Provider value={scrollProvider}>
          <CalendarContext.Provider value={calendar}>{children}</CalendarContext.Provider>
        </ScrollProviderContext.Provider>
      </RenderedInModalContext.Provider>
    </ModalContext.Provider>
  );
}

export default React.memo(CustomProvider);

import React from "react";

export interface ModalContextInterface {
  rootElement: HTMLElement;
  ignoreClickOutsideElements?: HTMLElement[];
}

export const ModalContext = React.createContext<ModalContextInterface>(null!);

export interface RenderedInModalContextActiveValue {
  openedPath: HTMLElement[];
  openedPathWithoutLastElement: HTMLElement[];
  addElementToPath: (modalRoot: HTMLElement) => () => void;
  canCloseOutside: boolean;
  enableCanCloseOutside: (id: string) => void;
  disableCanCloseOutside: (id: string) => void;
}

export const RenderedInModalContext = React.createContext<RenderedInModalContextActiveValue | false>(false);

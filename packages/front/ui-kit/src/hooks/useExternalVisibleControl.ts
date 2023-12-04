import React from "react";
import { useEffectSkipFirst } from "@worksolutions/react-utils";

export function useExternalVisibleControl(
  openedProp: boolean | undefined,
  { onOpen: onOpenProp, onClose: onCloseProp }: { onOpen?: () => void; onClose?: () => void },
  canClose = true,
) {
  const [{ opened }, setOptions] = React.useState(() => ({
    opened: openedProp === undefined ? false : openedProp,
    onOpen: onOpenProp,
    onClose: onCloseProp,
  }));

  useEffectSkipFirst(() => setOptions((state) => ({ ...state, onOpen: onOpenProp })), [onOpenProp]);
  useEffectSkipFirst(() => setOptions((state) => ({ ...state, onClose: onCloseProp })), [onCloseProp]);

  const open = React.useCallback(() => {
    setOptions((state) => {
      if (state.opened) return state;
      if (state.onOpen) state.onOpen();
      return { ...state, opened: true };
    });
  }, []);

  const closeExternally = React.useCallback(() => {
    if (!canClose) return;
    setOptions((state) => {
      if (!state.opened) return state;
      if (state.onClose) state.onClose();
      return { ...state, opened: false };
    });
  }, [canClose]);

  const closeInternally = React.useCallback(() => {
    setOptions((state) => (state.opened ? { ...state, opened: false } : state));
  }, []);

  // TODO: сделать ревизию
  useEffectSkipFirst(() => {
    if (openedProp === undefined) {
      if (opened) open();
      else closeExternally();

      return;
    }

    if (opened === openedProp) return;

    if (openedProp) open();
    else closeInternally();
  }, [opened, open, closeExternally, openedProp, closeInternally]);

  return { opened, open, close: closeExternally };
}

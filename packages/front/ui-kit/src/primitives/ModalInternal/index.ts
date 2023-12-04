import React from "react";
import { useProvideRef } from "@worksolutions/react-utils";
import { useKey } from "react-use";

import { ScrollProviderContextInterface } from "primitives/ScrollProvider";

import { ModalContext, RenderedInModalContext, RenderedInModalContextActiveValue } from "./context";

import { useExternalVisibleControl } from "hooks/useExternalVisibleControl";

const tuaBodyScrollLock = import("tua-body-scroll-lock");

export interface UseModalInterface {
  canClose?: boolean;
  opened: boolean;
  onOpen?: () => void;
  onClose: () => void;
  scrollProviderContextRef?: React.Ref<ScrollProviderContextInterface>;
}

export function useModal({
  canClose,
  opened: openedProp,
  onOpen,
  onClose,
  scrollProviderContextRef,
}: UseModalInterface) {
  const [scrollProvider, setScrollProvider] = React.useState<ScrollProviderContextInterface | null>(null);
  const { opened, open, close } = useExternalVisibleControl(openedProp, { onOpen, onClose }, canClose);

  React.useEffect(() => {
    if (!opened) return;
    let scrollElement: HTMLDivElement | null = null;
    const lockTimeout = setTimeout(() => {
      scrollElement = (scrollProvider?.scrollableElement as HTMLDivElement | undefined) ?? null;
      if (scrollElement) tuaBodyScrollLock.then(({ lock }) => lock(scrollElement));
    }, 100);

    return () => {
      clearTimeout(lockTimeout);
      if (scrollElement) tuaBodyScrollLock.then(({ unlock }) => unlock(scrollElement));
    };
  }, [scrollProvider, opened]);

  const initScrollProviderRef = useProvideRef(scrollProviderContextRef, setScrollProvider) as (
    ref: ScrollProviderContextInterface,
  ) => void;

  return { opened, initScrollProviderRef, open, close };
}

export function useModalSmartCloser(
  modalRoot: HTMLElement | null,
  close: () => void,
  { closeOnClickOutside = true }: { closeOnClickOutside?: boolean } = {},
) {
  const renderedInContextModal = React.useContext(RenderedInModalContext) as RenderedInModalContextActiveValue;
  const modalContext = React.useContext(ModalContext);

  const {
    addElementToPath,
    openedPathWithoutLastElement,
    canCloseOutside,
    enableCanCloseOutside,
    disableCanCloseOutside,
  } = renderedInContextModal;

  const isActiveModal = React.useMemo(
    () => renderedInContextModal.openedPath[renderedInContextModal.openedPath.length - 1] === modalRoot,
    [modalRoot, renderedInContextModal.openedPath],
  );
  const clickOutsideEnabled = closeOnClickOutside && isActiveModal && canCloseOutside;

  const escapeHandler = React.useCallback(() => isActiveModal && close(), [close, isActiveModal]);
  useKey("Escape", escapeHandler, undefined, [escapeHandler]);

  React.useEffect(() => {
    if (!modalRoot) return;
    return addElementToPath(modalRoot);
  }, [modalRoot, addElementToPath]);

  const clickOutsideIgnorePath = React.useMemo(
    () => [...openedPathWithoutLastElement, ...(modalContext.ignoreClickOutsideElements || [])],
    [modalContext.ignoreClickOutsideElements, openedPathWithoutLastElement],
  );

  return {
    onClickOutside: close,
    clickOutsideEnabled,
    clickOutsideIgnorePath,
    renderedInContextModal,
    enableCanCloseOutside,
    disableCanCloseOutside,
  };
}

export * from "./context";

export { default as RenderInModalContextProvider } from "./RenderInModalContext";

import React from "react";

import ModalRoot from "primitives/ModalRoot";
import { useModal } from "primitives/ModalInternal";

import { ModalInterface } from "./types";

import ModalContent from "./internal/ModalContent";
import ModalVerticalCenterHeightBalancer from "./internal/ModalVerticalCenterHeightBalancer";

import { AppearanceAnimation } from "hooks/useAppearanceAnimation";

import { appearanceAnimationStyleVariants, modalRootStyles } from "./style.css";

const appearanceAnimation: AppearanceAnimation = {
  duration: 200,
  from: appearanceAnimationStyleVariants.from,
  to: appearanceAnimationStyleVariants.to,
  transitionProperties: ["opacity"],
};

function Modal({ opened: openedProp, onOpen, onClose, children, scrollProviderContextRef, ...props }: ModalInterface) {
  const [modalRoot, setModalRoot] = React.useState<HTMLDivElement | null>(null);

  const { opened, close, initScrollProviderRef } = useModal({
    opened: openedProp,
    onOpen,
    onClose,
    scrollProviderContextRef,
  });

  return (
    <ModalRoot ref={setModalRoot} className={modalRootStyles} opened={opened} appearanceAnimation={appearanceAnimation}>
      <ModalVerticalCenterHeightBalancer />
      <ModalContent ref={initScrollProviderRef} {...props} modalRoot={modalRoot} close={close}>
        {children}
      </ModalContent>
    </ModalRoot>
  );
}

export default React.memo(Modal);

export { ModalContext, RenderedInModalContext } from "primitives/ModalInternal";
export type { ModalContextInterface, RenderedInModalContextActiveValue } from "primitives/ModalInternal";

export type { ModalInterface } from "./types";
export { default as ModalTitle } from "./internal/ModalTitle";
export type { ModalTitleInterface } from "./internal/ModalTitle";

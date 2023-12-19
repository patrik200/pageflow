import React from "react";

import ModalRoot from "primitives/ModalRoot";
import { useModal } from "primitives/ModalInternal";

import { AppearanceAnimation } from "hooks";

import { DrawerInterface } from "./types";

import DrawerContent from "./internal/DrawerContent";

import { appearanceAnimationStyleVariants, modalRootStyles } from "./style.css";

const modalRootAppearanceAnimation: AppearanceAnimation = {
  duration: 200,
  from: appearanceAnimationStyleVariants.from,
  to: appearanceAnimationStyleVariants.to,
  transitionProperties: ["opacity"],
};

function Drawer({
  className,
  opened: openedProp,
  onOpen,
  onClose,
  children,
  scrollProviderContextRef,
  appearancePosition,
  canClose = true,
}: DrawerInterface) {
  const [modalRoot, setModalRoot] = React.useState<HTMLDivElement | null>(null);

  const { opened, close, initScrollProviderRef } = useModal({
    opened: openedProp,
    onOpen,
    onClose,
    scrollProviderContextRef,
  });

  const handleClose = React.useCallback(() => {
    if (!canClose) return;
    close();
  }, [canClose, close]);

  return (
    <ModalRoot
      ref={setModalRoot}
      className={modalRootStyles}
      opened={opened}
      appearanceAnimation={modalRootAppearanceAnimation}
    >
      <DrawerContent
        ref={initScrollProviderRef}
        className={className}
        appearancePosition={appearancePosition}
        modalRoot={modalRoot}
        opened={opened}
        close={handleClose}
      >
        {children}
      </DrawerContent>
    </ModalRoot>
  );
}

export default React.memo(Drawer);

export { drawerWidthVar } from "./internal/DrawerContent";

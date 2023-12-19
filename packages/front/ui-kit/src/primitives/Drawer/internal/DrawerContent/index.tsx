import React from "react";
import cn from "classnames";

import { HandleClickOutside } from "main";

import Icon from "primitives/Icon";
import Scroll, { ScrollProviderContextInterface } from "primitives/Scroll";
import { DrawerAppearancePosition } from "primitives/Drawer/types";
import { useModalSmartCloser } from "primitives/ModalInternal";

import { AppearanceAnimation, useAppearanceAnimation } from "hooks";
import { ComponentWithRef } from "types";

import {
  appearanceAnimationLeftStyleVariants,
  appearanceAnimationRightStyleVariants,
  closeIconWrapperStyles,
  contentStyles,
  scrollStyles,
  wrapperStyles,
} from "./style.css";

interface DrawerContentInterface {
  className?: string;
  children: React.ReactNode;
  appearancePosition: DrawerAppearancePosition;
  modalRoot: HTMLElement | null;
  opened: boolean;
  close: () => void;
}

const appearanceAnimationByPosition: Record<DrawerAppearancePosition, AppearanceAnimation> = {
  left: {
    duration: 200,
    from: appearanceAnimationLeftStyleVariants.from,
    to: appearanceAnimationLeftStyleVariants.to,
    transitionProperties: ["transform"],
  },
  right: {
    duration: 200,
    from: appearanceAnimationRightStyleVariants.from,
    to: appearanceAnimationRightStyleVariants.to,
    transitionProperties: ["transform"],
  },
};

function DrawerContent(
  { className, children, opened: openedProp, appearancePosition, modalRoot, close }: DrawerContentInterface,
  ref: React.Ref<ScrollProviderContextInterface>,
) {
  const { clickOutsideIgnorePath, clickOutsideEnabled, onClickOutside } = useModalSmartCloser(modalRoot, close);

  const [opened, setOpened] = React.useState(false);
  React.useEffect(() => setOpened(openedProp), [openedProp]);

  const [{ animationClassName, animationStyle }, visible] = useAppearanceAnimation(
    opened,
    appearanceAnimationByPosition[appearancePosition],
  );

  if (!visible) return null;

  return (
    <>
      <div className={closeIconWrapperStyles} onClick={close}>
        <Icon icon="closeLine" />
      </div>
      <HandleClickOutside
        enabled={clickOutsideEnabled}
        ignoreElements={clickOutsideIgnorePath}
        onClickOutside={onClickOutside}
      >
        <div style={animationStyle} className={cn(className, wrapperStyles, animationClassName)}>
          <Scroll className={scrollStyles} scrollProviderRef={ref}>
            <div className={contentStyles}>{children}</div>
          </Scroll>
        </div>
      </HandleClickOutside>
    </>
  );
}

export default React.memo(React.forwardRef(DrawerContent)) as ComponentWithRef<
  DrawerContentInterface,
  ScrollProviderContextInterface
>;

export { drawerWidthVar } from "./style.css";

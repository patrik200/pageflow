import React from "react";
import cn from "classnames";

import { AppearanceAnimation, useAppearanceAnimation } from "hooks";

import PopperElementChildrenWrapper from "./internal/PopperElementChildrenWrapper";
import { PopupComponentInternalContextState } from "./internal/context";

import { defaultAppearanceAnimationStyleVariants, hiddenStyle } from "./style.css";

export interface PopupComponentInterface {
  forceVisible?: boolean;
  children: JSX.Element;
  appearanceAnimation?: AppearanceAnimation;
  stopPropagation?: boolean;
}

const defaultAppearanceAnimation: AppearanceAnimation = {
  duration: 200,
  from: defaultAppearanceAnimationStyleVariants.from,
  to: defaultAppearanceAnimationStyleVariants.to,
  transitionProperties: ["opacity"],
};

function PopupComponent({
  children,
  appearanceAnimation = defaultAppearanceAnimation,
  forceVisible,
  stopPropagation: stopPropagationProp,
}: PopupComponentInterface) {
  const { triggerHTMLNode, initializePopupRef, popper, width, context, recalculatePopupWidth } = React.useContext(
    PopupComponentInternalContextState,
  );

  const state = popper?.state;
  const [{ animationClassName, animationStyle }, visible] = useAppearanceAnimation(
    forceVisible || context.visible,
    appearanceAnimation,
  );

  if (!visible && !forceVisible) return null;

  return (
    <PopperElementChildrenWrapper
      ref={initializePopupRef}
      className={cn(animationClassName, !state && hiddenStyle)}
      update={popper?.update}
      style={{ ...state?.styles.popper, width, ...animationStyle }}
      triggerElement={triggerHTMLNode}
      stopPropagation={stopPropagationProp}
      recalculatePopupWidth={recalculatePopupWidth}
      data-popup
      {...state?.attributes.popper}
    >
      {children}
    </PopperElementChildrenWrapper>
  );
}

export default React.memo(PopupComponent);

export { PopupComponentInternalContextState } from "./internal/context";
export type { PopupComponentInternalContextStateInterface } from "./internal/context";

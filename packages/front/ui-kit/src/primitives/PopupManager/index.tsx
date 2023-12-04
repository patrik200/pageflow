import React from "react";
import type { PositioningStrategy, Placement } from "@popperjs/core";
import { provideRef } from "@worksolutions/react-utils";

import PopupManagerForClick, { PopupManagerForClickInterface } from "./PopupManagers/Click/PopupManager";
import PopupManagerForHover, { PopupManagerForHoverInterface } from "./PopupManagers/Hover/PopupManager";
import PopupManagerForExternal, { PopupManagerForExternalInterface } from "./PopupManagers/External/PopupManager";
import { getPopupWidth, PopupManagerModifierOffset } from "./libs";

export enum PopupManagerMode {
  HOVER = "HOVER",
  CLICK = "CLICK",
  EXTERNAL = "EXTERNAL",
}

export type PopupManagerInterface = {
  primaryPlacement?: Placement;
  onVisibilityChange?: (visible: boolean) => void;
  offset?: PopupManagerModifierOffset;
  maxHeight?: number | false;
  disabled?: boolean;
  popupElement: React.ReactNode;
  popupWidth?: "full" | "auto";
  strategy?: PositioningStrategy;
  triggerElement: React.JSX.Element;
} & (
  | ({
      mode: PopupManagerMode.CLICK;
    } & Pick<PopupManagerForClickInterface, "closeOnClickOutside" | "toggleOnClick">)
  | ({
      mode: PopupManagerMode.HOVER;
    } & Pick<PopupManagerForHoverInterface, "showDelay" | "hideDelay">)
  | ({
      mode: PopupManagerMode.EXTERNAL;
    } & Pick<PopupManagerForExternalInterface, "opened">)
);

function PopupManager({
  primaryPlacement = "bottom-start",
  popupWidth: popupWidthProp,
  disabled,
  popupElement,
  triggerElement,
  offset,
  maxHeight,
  strategy,
  onVisibilityChange,
  ...props
}: PopupManagerInterface) {
  const [triggerHTMLNode, setTriggerHTMLNode] = React.useState<HTMLElement | null>(null);

  const resultTriggerElement = React.cloneElement(triggerElement, {
    ref: provideRef(setTriggerHTMLNode, (triggerElement as any).ref),
  });

  const calculatePopupWidth = React.useCallback(
    () => getPopupWidth(triggerHTMLNode?.offsetWidth, popupWidthProp),
    [triggerHTMLNode, popupWidthProp],
  );

  const [popupWidth, setPopupWidth] = React.useState(calculatePopupWidth);
  const recalculatePopupWidth = React.useCallback(() => setPopupWidth(calculatePopupWidth), [calculatePopupWidth]);

  if (props.mode === PopupManagerMode.HOVER) {
    return (
      <PopupManagerForHover
        hideDelay={props.hideDelay}
        showDelay={props.showDelay}
        disabled={disabled}
        triggerElement={resultTriggerElement}
        triggerHTMLNode={triggerHTMLNode}
        primaryPlacement={primaryPlacement}
        popupElement={popupElement}
        offset={offset}
        maxHeight={maxHeight}
        strategy={strategy}
        width={popupWidth}
        recalculatePopupWidth={recalculatePopupWidth}
        onVisibilityChange={onVisibilityChange}
      />
    );
  }

  if (props.mode === PopupManagerMode.CLICK) {
    return (
      <PopupManagerForClick
        closeOnClickOutside={props.closeOnClickOutside}
        toggleOnClick={props.toggleOnClick}
        disabled={disabled}
        triggerElement={resultTriggerElement}
        triggerHTMLNode={triggerHTMLNode}
        primaryPlacement={primaryPlacement}
        popupElement={popupElement}
        offset={offset}
        maxHeight={maxHeight}
        strategy={strategy}
        width={popupWidth}
        recalculatePopupWidth={recalculatePopupWidth}
        onVisibilityChange={onVisibilityChange}
      />
    );
  }

  return (
    <PopupManagerForExternal
      opened={props.opened}
      disabled={disabled}
      triggerElement={resultTriggerElement}
      triggerHTMLNode={triggerHTMLNode}
      primaryPlacement={primaryPlacement}
      popupElement={popupElement}
      offset={offset}
      maxHeight={maxHeight}
      strategy={strategy}
      width={popupWidth}
      recalculatePopupWidth={recalculatePopupWidth}
      onVisibilityChange={onVisibilityChange}
    />
  );
}

export default React.memo(PopupManager);

export { default as PopupComponent } from "./PopupComponent";
export * from "./PopupComponent";
export type { PopupManagerModifierOffset } from "./libs";

import React from "react";

import PopupManager, { PopupManagerInterface, PopupManagerMode } from "primitives/PopupManager";
import { ScrollProviderContextInterface } from "primitives/ScrollProvider";

import { SelectableListInterface, SelectableListValue } from "./SelectableList";
import SelectableListPopupElement from "./SelectableListPopupElement";

export type PopupSelectableListInterface<VALUE extends SelectableListValue> = Pick<
  PopupManagerInterface,
  "strategy" | "primaryPlacement" | "disabled" | "offset" | "maxHeight" | "popupWidth"
> &
  SelectableListInterface<VALUE> & {
    beforeList?: React.ReactNode;
    afterList?: React.ReactNode;
    emptyList?: React.ReactNode;
    triggerElement: JSX.Element;
    toggleOnClick?: boolean;
    closeOnChange?: boolean;
    scrollProviderRef?: React.Ref<ScrollProviderContextInterface>;
    onVisibilityChange?: (visible: boolean) => void;
    children: React.ReactNode;
  };

function PopupSelectableList({
  strategy,
  primaryPlacement,
  offset,
  maxHeight,
  disabled,
  children,
  triggerElement,
  popupWidth = "full",
  toggleOnClick,
  closeOnChange = true,
  onVisibilityChange,
  onSelect,
  ...props
}: PopupSelectableListInterface<any>) {
  return (
    <PopupManager
      mode={PopupManagerMode.CLICK}
      onVisibilityChange={onVisibilityChange}
      popupWidth={popupWidth}
      offset={offset}
      maxHeight={maxHeight}
      strategy={strategy}
      primaryPlacement={primaryPlacement}
      disabled={disabled}
      popupElement={
        <SelectableListPopupElement closeOnChange={closeOnChange} onSelect={onSelect} {...props}>
          {children}
        </SelectableListPopupElement>
      }
      triggerElement={triggerElement}
      toggleOnClick={toggleOnClick}
    />
  );
}

export default React.memo(PopupSelectableList) as <VALUE extends SelectableListValue>(
  props: PopupSelectableListInterface<VALUE>,
) => JSX.Element;

export { default as SelectableListItem } from "./SelectableList/SelectableListItem";
export type { SelectableListItemInterface } from "./SelectableList/SelectableListItem";
export { default as SelectableListItemGroup } from "./SelectableList/SelectableListItemGroup";
export type { SelectableListItemGroupInterface } from "./SelectableList/SelectableListItemGroup";

export { SelectableListContext } from "./SelectableList";
export type { SelectableListValue } from "./SelectableList";

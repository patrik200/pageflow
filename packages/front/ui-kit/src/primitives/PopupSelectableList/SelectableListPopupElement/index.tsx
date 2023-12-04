import React from "react";
import cn from "classnames";

import { PopupComponent } from "primitives/PopupManager";
import { ScrollProviderContextInterface } from "primitives/ScrollProvider";

import SelectableList, { SelectableListValue } from "../SelectableList";

import { useSelectableListPopupElement } from "./hooks";

import { selectableListPopupElementStyle } from "./style.css";

interface SelectableListPopupElementInterface {
  className?: string;
  checkPrivateHiddenPropsForDetectEmptyList?: boolean;
  beforeList?: React.ReactNode;
  afterList?: React.ReactNode;
  emptyList?: React.ReactNode;
  children?: React.ReactNode;
  closeOnChange: boolean;
  onSelect: (value: SelectableListValue) => void;
  scrollProviderRef?: React.Ref<ScrollProviderContextInterface>;
}

function SelectableListPopupElement({
  className,
  beforeList,
  afterList,
  emptyList,
  children,
  closeOnChange,
  onSelect,
  scrollProviderRef,
}: SelectableListPopupElementInterface) {
  const { handleSelect, setListScrollProvider } = useSelectableListPopupElement({
    closeOnChange,
    onSelect,
    scrollProviderRef,
  });

  const childrenArray = React.Children.toArray(children);

  const { renderAll, renderEmptyList } = React.useMemo(() => {
    const hasEmptyList = !!emptyList;

    const hasSomeVisibleElement = childrenArray.some((child) =>
      React.isValidElement(child) ? !child.props.__hidden : true,
    );

    return { renderAll: hasSomeVisibleElement || hasEmptyList, renderEmptyList: !hasSomeVisibleElement };
  }, [childrenArray, emptyList]);

  if (!renderAll) return null;

  return (
    <PopupComponent>
      <div className={cn(selectableListPopupElementStyle, className)}>
        {beforeList}
        {renderEmptyList ? (
          emptyList
        ) : (
          <SelectableList scrollProviderRef={setListScrollProvider} onSelect={handleSelect}>
            {children}
          </SelectableList>
        )}
        {afterList}
      </div>
    </PopupComponent>
  );
}

export default React.memo(SelectableListPopupElement);

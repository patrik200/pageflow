import React from "react";
import { provideRef } from "@worksolutions/react-utils";

import { ScrollProviderContextInterface } from "primitives/ScrollProvider";
import { VisibilityManagerContext } from "primitives/VisibilityManager";

import { SelectableListValue } from "../SelectableList";

export function useSelectableListPopupElement({
  onSelect,
  scrollProviderRef,
  closeOnChange,
}: {
  onSelect: (value: SelectableListValue) => void;
  scrollProviderRef?: React.Ref<ScrollProviderContextInterface>;
  closeOnChange: boolean;
}) {
  const context = React.useContext(VisibilityManagerContext);

  const handleSelect = React.useCallback(
    (value: SelectableListValue) => {
      if (closeOnChange) context.hide();
      onSelect(value);
    },
    [closeOnChange, context, onSelect],
  );
  const [listScrollProvider, setListScrollProvider] = React.useState<ScrollProviderContextInterface | null>();

  React.useEffect(() => {
    if (!scrollProviderRef || !listScrollProvider) return;
    provideRef(scrollProviderRef)(listScrollProvider);
  }, [listScrollProvider, scrollProviderRef]);

  return { handleSelect, setListScrollProvider };
}

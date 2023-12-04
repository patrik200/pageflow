import React from "react";
import { provideRef } from "@worksolutions/react-utils";

import { ScrollProviderContextInterface } from "primitives/ScrollProvider";

import { PropsWithRef } from "types";

import { SelectableListValue } from "./types";

import List, { ListInterface } from "./List";

export const SelectableListContext = React.createContext<{ onSelect: (value: SelectableListValue) => void }>(null!);

export interface SelectableListInterface<VALUE extends SelectableListValue> extends ListInterface {
  onSelect: (value: VALUE) => void;
}

function SelectableList(
  { onSelect, scrollProviderRef, ...props }: SelectableListInterface<any>,
  ref: React.Ref<HTMLDivElement>,
) {
  const customScrollProviderRef = React.useCallback(
    (scrollProviderContext: ScrollProviderContextInterface) => {
      provideRef(scrollProviderRef)(scrollProviderContext);
      provideRef(ref)(scrollProviderContext.wrapperElement);
    },
    [ref, scrollProviderRef],
  );

  return (
    <SelectableListContext.Provider value={React.useMemo(() => ({ onSelect }), [onSelect])}>
      <List {...props} scrollProviderRef={customScrollProviderRef} />
    </SelectableListContext.Provider>
  );
}

export default React.memo(React.forwardRef(SelectableList)) as <VALUE extends SelectableListValue>(
  props: PropsWithRef<SelectableListInterface<VALUE>, HTMLDivElement>,
) => JSX.Element;

export type { SelectableListValue } from "./types";

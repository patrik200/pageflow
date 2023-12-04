import React from "react";
import { searchInString } from "@worksolutions/utils";

import { SelectableListValue } from "../PopupSelectableList";

import { SelectFieldOption } from "./index";

export function useViewOptions<ValueType extends SelectableListValue>(
  search: string,
  options: SelectFieldOption<ValueType, true | false>[],
) {
  return React.useMemo(() => {
    if (search === "") return options;
    return options.filter(
      (option) =>
        searchInString(option.label, search) ||
        (option.secondaryLabel ? searchInString(option.secondaryLabel, search) : false),
    );
  }, [options, search]);
}

import React from "react";
import { observer } from "mobx-react-lite";
import { PopupManagerInterface, SelectableListValue, SelectField, SelectFieldOption } from "@app/ui-kit";
import cn from "classnames";

import { fieldStyles } from "./style.css";

interface FilterSelectFieldInterface<VALUE extends SelectableListValue> {
  className?: string;
  desktopPopupClassName?: string;
  popupWidth?: PopupManagerInterface["popupWidth"];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyListText?: string;
  value: VALUE;
  placeholder: string;
  loading?: boolean;
  options: SelectFieldOption<VALUE>[];
  onChange: (value: VALUE) => void;
}

function FilterSelectField<VALUE extends SelectableListValue>({
  className,
  ...props
}: FilterSelectFieldInterface<VALUE>) {
  return <SelectField className={cn(fieldStyles, className)} dots {...props} />;
}

export default observer(FilterSelectField);

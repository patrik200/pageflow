import React from "react";
import { observer } from "mobx-react-lite";
import { PopupManagerInterface, SelectableListValue, SelectField } from "@app/ui-kit";
import cn from "classnames";
import { useTranslation } from "@app/front-kit";

import { useAllUsersSelectFieldOptions } from "components/FormField/UserSelect";

import { fieldStyles } from "./style.css";

interface FilterUserFieldInterface<VALUE extends SelectableListValue> {
  className?: string;
  desktopPopupClassName?: string;
  popupWidth?: PopupManagerInterface["popupWidth"];
  value: VALUE;
  placeholder: string;
  loading?: boolean;
  onChange: (value: VALUE) => void;
}

function FilterUserField<VALUE extends SelectableListValue>({ className, ...props }: FilterUserFieldInterface<VALUE>) {
  const { t } = useTranslation();

  const options = useAllUsersSelectFieldOptions<true, VALUE>(true);

  return (
    <SelectField
      className={cn(fieldStyles, className)}
      dots
      options={options}
      searchPlaceholder={t({ scope: "common_filter_fields", place: "user", name: "search_placeholder" })}
      emptyListText={t({ scope: "common_filter_fields", place: "user", name: "empty_list" })}
      {...props}
    />
  );
}

export default observer(FilterUserField);

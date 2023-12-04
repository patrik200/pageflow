import React from "react";
import { observer } from "mobx-react-lite";
import { TextField } from "@app/ui-kit";

import { fieldStyles } from "./style.css";

interface FilterSearchTextFieldInterface {
  value: string;
  placeholder: string;
  loading?: boolean;
  onChangeInput: (value: string) => void;
}

function FilterSearchTextField({ value, loading, placeholder, onChangeInput }: FilterSearchTextFieldInterface) {
  return (
    <TextField
      className={fieldStyles}
      loading={loading}
      value={value}
      fieldItemLeft="searchLine"
      placeholder={placeholder}
      onChangeInput={onChangeInput}
    />
  );
}

export default observer(FilterSearchTextField);

import React from "react";
import { observer } from "mobx-react-lite";
import { Checkbox } from "@app/ui-kit";

import { fieldStyles } from "./style.css";

interface FilterCheckboxFieldInterface {
  value: boolean;
  title: string;
  onChange: (value: boolean) => void;
}

function FilterCheckboxField({ value, title, onChange }: FilterCheckboxFieldInterface) {
  return (
    <Checkbox className={fieldStyles} value={value} onChange={onChange}>
      {title}
    </Checkbox>
  );
}

export default observer(FilterCheckboxField);

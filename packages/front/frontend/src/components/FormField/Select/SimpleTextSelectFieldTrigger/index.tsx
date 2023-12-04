import React from "react";
import { observer } from "mobx-react-lite";
import { SelectableListValue, SelectFieldOption, SelectFieldTriggerInterface, Typography } from "@app/ui-kit";
import cn from "classnames";

import { contentWrapperStyles, primaryTextStyles, secondaryTextStyles, textDotsStyles } from "./style.css";

interface SimpleTextSelectFieldTriggerInterface extends SelectFieldTriggerInterface {
  activeOption: SelectFieldOption<SelectableListValue> | null;
}

function SimpleTextSelectFieldTrigger(
  { dots, activeOption }: SimpleTextSelectFieldTriggerInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  if (!activeOption) return null;

  return (
    <div ref={ref} className={contentWrapperStyles}>
      <Typography className={cn(primaryTextStyles, dots && textDotsStyles)}>{activeOption.label}</Typography>
      {activeOption.secondaryLabel && (
        <Typography className={cn(secondaryTextStyles, dots && textDotsStyles)}>
          {activeOption.secondaryLabel}
        </Typography>
      )}
    </div>
  );
}

export default observer(React.forwardRef(SimpleTextSelectFieldTrigger));

import React from "react";
import { observer } from "mobx-react-lite";
import {
  InputFieldWrapper,
  SelectableListValue,
  SelectFieldOption,
  SelectFieldTriggerInterface,
  TextFieldWrapper,
  Typography,
} from "@app/ui-kit";
import cn from "classnames";

import {
  contentWrapperStyles,
  inputFieldWrapperStyles,
  primaryTextStyles,
  secondaryTextStyles,
  textDotsStyles,
} from "./style.css";

interface UserRowCustomSelectFieldTriggerInterface extends SelectFieldTriggerInterface {
  activeOption: SelectFieldOption<SelectableListValue> | null;
}

function UserRowCustomSelectFieldTrigger(
  {
    inputFieldWrapperClassName,
    disabled,
    loading,
    dots,
    fieldItemLeft,
    fieldItemRight = "expandUpDownLine",
    required,
    activeOption,
    ...props
  }: UserRowCustomSelectFieldTriggerInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <TextFieldWrapper ref={ref} required={required} {...props}>
      <InputFieldWrapper
        className={cn(inputFieldWrapperStyles, inputFieldWrapperClassName)}
        disabled={disabled}
        fieldItemRight={fieldItemRight}
        loading={loading}
        fieldItemLeft={fieldItemLeft}
      >
        {activeOption && (
          <div className={contentWrapperStyles}>
            <Typography className={cn(primaryTextStyles, dots && textDotsStyles)}>{activeOption.label}</Typography>
            {activeOption.secondaryLabel && (
              <Typography className={cn(secondaryTextStyles, dots && textDotsStyles)}>
                {activeOption.secondaryLabel}
              </Typography>
            )}
          </div>
        )}
      </InputFieldWrapper>
    </TextFieldWrapper>
  );
}

export default observer(React.forwardRef(UserRowCustomSelectFieldTrigger));

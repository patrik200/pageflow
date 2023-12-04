import React from "react";
import cn from "classnames";

import Typography from "primitives/Typography";
import TextFieldWrapper, { TextFieldWrapperInterface } from "primitives/TextField/TextFieldWrapper";
import InputFieldWrapper, {
  InputFieldWrapperInterface,
} from "primitives/InputField/InternalComponents/InputFieldWrapper";
import InputFieldVirtualPlaceholder from "primitives/InputField/InternalComponents/InputFieldNativeInput/VirtualPlaceholder";

import { ComponentWithRef } from "types";

import {
  inputFieldWrapperStyles,
  inputTextWrapperSizeStyleVariants,
  inputTextWrapperStyles,
  textDotsStyles,
  textPlaceholderStyles,
  textSizeStyleVariants,
  textStyles,
} from "./style.css";

export type SelectFieldTriggerInterface = {
  inputFieldWrapperClassName?: string;
  fieldValue: string;
  placeholder?: string;
  materialPlaceholder?: boolean;
  dots?: boolean;
} & Omit<TextFieldWrapperInterface, "children"> &
  Pick<InputFieldWrapperInterface, "loading" | "disabled" | "fieldItemLeft" | "fieldItemRight" | "size">;

function SelectFieldTrigger(
  {
    inputFieldWrapperClassName,
    placeholder,
    disabled,
    loading,
    fieldValue,
    dots,
    fieldItemLeft,
    fieldItemRight = "expandUpDownLine",
    materialPlaceholder = true,
    required,
    size = "default",
    ...props
  }: SelectFieldTriggerInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <TextFieldWrapper ref={ref} required={required} {...props}>
      <InputFieldWrapper
        className={cn(inputFieldWrapperStyles, inputFieldWrapperClassName)}
        disabled={disabled}
        loading={loading}
        fieldItemRight={fieldItemRight}
        fieldItemLeft={fieldItemLeft}
        size={size}
      >
        <div
          data-has-text={!!fieldValue}
          className={cn(inputTextWrapperStyles, inputTextWrapperSizeStyleVariants[size])}
        >
          <Typography className={cn(textStyles, textSizeStyleVariants[size], dots && textDotsStyles)}>
            {fieldValue || (
              <span className={textPlaceholderStyles}>
                <InputFieldVirtualPlaceholder
                  size={size}
                  focused={false}
                  hasText={false}
                  placeholder={placeholder}
                  materialPlaceholder={false}
                  forceShowAsterisk
                  required={required}
                />
              </span>
            )}
          </Typography>
          <InputFieldVirtualPlaceholder
            size={size}
            focused={false}
            hasText={!!fieldValue}
            placeholder={placeholder}
            materialPlaceholder={materialPlaceholder}
            required={required}
          />
        </div>
      </InputFieldWrapper>
    </TextFieldWrapper>
  );
}

export default React.memo(React.forwardRef(SelectFieldTrigger)) as ComponentWithRef<
  SelectFieldTriggerInterface,
  HTMLDivElement
>;

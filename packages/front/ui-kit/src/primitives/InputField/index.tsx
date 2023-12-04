import React from "react";
import { eventValue } from "@worksolutions/react-utils";

import { ComponentWithRef } from "types";

import StyledInput, { InputFieldNativeInputInterface } from "./InternalComponents/InputFieldNativeInput";
import InputFieldWrapper, { InputFieldWrapperInterface } from "./InternalComponents/InputFieldWrapper";

export type InputFieldInterface = {
  inputRef?: React.Ref<HTMLInputElement>;
  onChangeInput?: (value: string) => void;
} & Omit<InputFieldWrapperInterface, "children"> &
  Omit<InputFieldNativeInputInterface, "className">;

function InputField(
  {
    as,
    inputRef,
    value,
    disabled,
    center,
    placeholder,
    autoFocus,
    inputMode,
    type,
    maxLength,
    textArea,
    rows,
    materialPlaceholder,
    required,
    informer,
    size,
    onChangeInput,
    onChange,
    onBlur,
    onClick,
    onFocus,
    ...props
  }: InputFieldInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(event);
      if (onChangeInput) eventValue(onChangeInput)(event);
    },
    [onChange, onChangeInput],
  );

  return (
    <InputFieldWrapper ref={ref} disabled={disabled} textArea={textArea} size={size} {...props}>
      <StyledInput
        ref={inputRef}
        as={as}
        value={value}
        autoFocus={autoFocus}
        disabled={disabled}
        placeholder={placeholder}
        center={center}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        textArea={textArea}
        rows={rows}
        materialPlaceholder={materialPlaceholder}
        required={required}
        informer={informer}
        size={size}
        onChange={handleChange}
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
      />
    </InputFieldWrapper>
  );
}

export default React.memo(React.forwardRef(InputField)) as ComponentWithRef<InputFieldInterface, HTMLDivElement>;

export * from "./InternalComponents/InputFieldWrapper";
export { default as InputFieldWrapper } from "./InternalComponents/InputFieldWrapper";
export * from "./InternalComponents/InputFieldNativeInput/VirtualPlaceholder";
export { default as InputFieldNativeVirtualPlaceholder } from "./InternalComponents/InputFieldNativeInput/VirtualPlaceholder";

export * from "./types";

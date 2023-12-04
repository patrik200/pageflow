import React from "react";

import InputField, { InputFieldInterface } from "primitives/InputField";

import { ComponentWithRef } from "types";

import TextFieldWrapper, { TextFieldWrapperInterface } from "./TextFieldWrapper";

export type TextFieldInterface = Omit<InputFieldInterface, "error" | "className"> &
  Omit<TextFieldWrapperInterface, "children" | "required">;

function TextField(
  {
    as,
    label,
    required,
    errorMessage,
    inputRef,
    inputMode,
    type,
    loading,
    value,
    center,
    fieldItemRight,
    fieldItemLeft,
    disabled,
    autoFocus,
    placeholder,
    maxLength,
    textArea,
    rows,
    materialPlaceholder,
    informer,
    size,
    onChangeInput,
    onChange,
    onClick,
    onBlur,
    onFocus,
    ...props
  }: TextFieldInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <TextFieldWrapper
      label={label}
      required={materialPlaceholder ? false : required}
      errorMessage={errorMessage}
      {...props}
    >
      <InputField
        as={as}
        ref={ref}
        inputRef={inputRef}
        inputMode={inputMode}
        type={type}
        loading={loading}
        value={value}
        center={center}
        fieldItemRight={fieldItemRight}
        fieldItemLeft={fieldItemLeft}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder={placeholder}
        error={!!errorMessage}
        maxLength={maxLength}
        textArea={textArea}
        rows={rows}
        materialPlaceholder={materialPlaceholder}
        required={required}
        informer={informer}
        size={size}
        onChangeInput={onChangeInput}
        onChange={onChange}
        onClick={onClick}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </TextFieldWrapper>
  );
}

export default React.memo(React.forwardRef(TextField)) as ComponentWithRef<TextFieldInterface, HTMLDivElement>;

export { default as TextFieldWrapper } from "./TextFieldWrapper";
export type { TextFieldWrapperInterface } from "./TextFieldWrapper";

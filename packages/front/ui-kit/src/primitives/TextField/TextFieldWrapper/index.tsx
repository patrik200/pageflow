import React from "react";
import cn from "classnames";

import { ComponentWithRef } from "types";

import InputHeader from "./internal/Header";
import ErrorMessage from "./internal/Error";
import Hint from "./internal/Hint";

import { wrapperStyles } from "./style.css";

export interface TextFieldWrapperInterface {
  style?: Record<string, any>;
  className?: string;
  children: React.ReactNode;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  hint?: string;
  absoluteTemplatingError?: boolean;
}

function TextFieldWrapper(
  {
    style,
    className,
    children,
    label,
    errorMessage,
    required,
    absoluteTemplatingError = false,
    hint,
  }: TextFieldWrapperInterface,
  ref?: React.Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref} style={style} className={cn(wrapperStyles, className)}>
      {label && <InputHeader required={required}>{label}</InputHeader>}
      {children}
      {hint && !errorMessage && <Hint>{hint}</Hint>}
      {errorMessage && <ErrorMessage absoluteTemplating={absoluteTemplatingError}>{errorMessage}</ErrorMessage>}
    </div>
  );
}

export default React.memo(React.forwardRef(TextFieldWrapper)) as ComponentWithRef<
  TextFieldWrapperInterface,
  HTMLDivElement
>;

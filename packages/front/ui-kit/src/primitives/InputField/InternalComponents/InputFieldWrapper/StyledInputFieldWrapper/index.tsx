import React from "react";
import cn from "classnames";

import { ComponentWithRef } from "types";

import { InputSize } from "../../../types";

import {
  errorStyle,
  wrapperDisabledStyles,
  wrapperStyles,
  wrapperTypeDefaultStyleVariants,
  wrapperTypeSmallStyleVariants,
} from "./style.css";

export interface StyledInputFieldWrapperInterface {
  className?: string;
  disabled?: boolean;
  error?: boolean;
  textArea?: boolean;
  size?: InputSize;
  children: React.ReactNode;
}

function StyledInputFieldWrapper(
  { className, disabled, error, textArea, size = "default", children }: StyledInputFieldWrapperInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  const inputType = textArea ? "textarea" : "input";

  return (
    <div
      ref={ref}
      className={cn(
        className,
        size === "default" ? wrapperTypeDefaultStyleVariants[inputType] : wrapperTypeSmallStyleVariants[inputType],
        disabled && wrapperDisabledStyles,
        wrapperStyles,
        error && errorStyle,
      )}
    >
      {children}
    </div>
  );
}

export default React.memo(React.forwardRef(StyledInputFieldWrapper)) as ComponentWithRef<
  StyledInputFieldWrapperInterface,
  HTMLDivElement
>;

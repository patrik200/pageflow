import React from "react";

import Spinner from "primitives/Spinner";
import { IconOrElementType } from "primitives/Icon";

import { ComponentWithRef } from "types";

import StyledInputFieldWrapper, { StyledInputFieldWrapperInterface } from "./StyledInputFieldWrapper";
import FieldItem from "./FieldItem";

import { spinnerStyles } from "./style.css";

export type InputFieldWrapperInterface = {
  fieldItemLeft?: IconOrElementType;
  fieldItemRight?: IconOrElementType;
  loading?: boolean;
} & StyledInputFieldWrapperInterface;

function InputFieldWrapper(
  { textArea, fieldItemLeft, fieldItemRight, loading, size, children, ...props }: InputFieldWrapperInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <StyledInputFieldWrapper ref={ref} textArea={textArea} size={size} {...props}>
      {fieldItemLeft && (
        <FieldItem position="left" size={size}>
          {fieldItemLeft}
        </FieldItem>
      )}
      {children}
      {loading && (
        <FieldItem position="right" size={size}>
          <Spinner className={spinnerStyles} />
        </FieldItem>
      )}
      {!loading && fieldItemRight && (
        <FieldItem position="right" size={size}>
          {fieldItemRight}
        </FieldItem>
      )}
    </StyledInputFieldWrapper>
  );
}

export default React.memo(React.forwardRef(InputFieldWrapper)) as ComponentWithRef<
  InputFieldWrapperInterface,
  HTMLDivElement
>;

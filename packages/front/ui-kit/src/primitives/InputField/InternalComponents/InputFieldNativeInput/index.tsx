import React, { InputHTMLAttributes } from "react";
import cn from "classnames";
import { useProvideRef } from "@worksolutions/react-utils";

import { AsComponent, ComponentWithRef } from "types";

import InputFieldVirtualPlaceholder from "./VirtualPlaceholder";
import { InputSize } from "../../types";

import { inputStyles, textAreaStyles, textCenterStyles, wrapperStyles } from "./style.css";

export type InputFieldNativeInputInterface = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | "autoFocus"
  | "disabled"
  | "inputMode"
  | "type"
  | "placeholder"
  | "maxLength"
  | "onChange"
  | "onFocus"
  | "onBlur"
  | "onClick"
> & {
  className?: string;
  as?: AsComponent<{}>;
  center?: boolean;
  value: string;
  textArea?: boolean;
  rows?: number;
  materialPlaceholder?: boolean;
  required?: boolean;
  informer?: React.JSX.Element;
  size?: InputSize;
};

function InputFieldNativeInput(
  {
    className,
    center = false,
    textArea,
    as: asProp,
    placeholder,
    materialPlaceholder = true,
    required,
    informer,
    size = "default",
    onFocus,
    onBlur,
    ...props
  }: InputFieldNativeInputInterface,
  ref: React.Ref<HTMLInputElement>,
) {
  const Component = (asProp || (textArea ? "textarea" : "input")) as React.FC<React.JSX.IntrinsicElements["input"]>;
  const isTextarea = (Component as any as string) === "textarea";

  const [focused, setFocused] = React.useState(false);
  const handleFocus = React.useCallback(
    (ev: React.SyntheticEvent<HTMLInputElement, FocusEvent>) => {
      onFocus?.(ev as any);
      setFocused(true);
    },
    [onFocus],
  );
  const handleBlur = React.useCallback(
    (ev: React.SyntheticEvent<HTMLInputElement, FocusEvent>) => {
      onBlur?.(ev as any);
      setFocused(false);
    },
    [onBlur],
  );

  const inputRef = React.useRef<HTMLInputElement>();
  const handlePlaceholderClick = React.useCallback(() => inputRef.current?.focus(), []);

  return (
    <div className={wrapperStyles}>
      <Component
        ref={useProvideRef(ref, inputRef)}
        className={cn(className, inputStyles, center && textCenterStyles, isTextarea && textAreaStyles)}
        autoComplete="nope"
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      <InputFieldVirtualPlaceholder
        focused={focused}
        hasText={props.value.length !== 0}
        placeholder={placeholder}
        materialPlaceholder={materialPlaceholder}
        required={required}
        informer={informer}
        size={size}
        onClick={handlePlaceholderClick}
      />
    </div>
  );
}

export default React.memo(React.forwardRef(InputFieldNativeInput)) as ComponentWithRef<
  InputFieldNativeInputInterface,
  HTMLInputElement
>;

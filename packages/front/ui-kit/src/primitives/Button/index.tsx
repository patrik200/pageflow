import React from "react";
import { preventDefaultHandler } from "@worksolutions/react-utils";
import cn from "classnames";

import { InternalIcons } from "primitives/Icon";
import { inheritAllTextParamsRequiredStyle, typographyOptionalStyleVariants } from "primitives/Typography";

import { AsComponent, ComponentWithRef } from "types";

import { ButtonSize, ButtonType } from "./types";

import { useButtonElements, UseButtonElementsInterface } from "./hooks/useButtonElements";

import { buttonNotDisabledStyles, buttonSizeStyleVariants, buttonStyleVariants, commonButtonStyle } from "./style.css";

export type ButtonInterface = {
  style?: Record<string, string>;
  className?: string;
  as?: AsComponent<{}>;
  loading?: boolean;
  dots?: boolean;
  noWrap?: boolean;
  iconLeft?: InternalIcons | React.ReactNode;
  iconRight?: InternalIcons | React.ReactNode;
  type?: ButtonType;
  size?: ButtonSize;
  children?: React.ReactNode;
  tabIndex?: number;
  preventDefault?: boolean;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<any>) => void;
} & Pick<
  UseButtonElementsInterface,
  "wrapCustomJSXIconElementToIconContainer" | "leftIconClassName" | "rightIconClassName"
>;

function Button(
  {
    as,
    style,
    className,
    leftIconClassName,
    rightIconClassName,
    dots,
    noWrap,
    children,
    preventDefault: preventDefaultProp = true,
    disabled,
    iconLeft,
    iconRight,
    loading,
    type = "PRIMARY",
    size = "MEDIUM",
    wrapCustomJSXIconElementToIconContainer,
    onClick,
  }: ButtonInterface,
  ref: React.Ref<HTMLButtonElement>,
) {
  const Component = (as || "button") as React.FC<React.JSX.IntrinsicElements["button"]>;

  const { iconLeftElement, iconRightElement } = useButtonElements({
    content: { iconLeft, iconRight },
    loading,
    hasChildren: !!children,
    wrapCustomJSXIconElementToIconContainer,
    leftIconClassName,
    rightIconClassName,
    size,
  });

  const resultDisabled = disabled || loading;

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (preventDefaultProp) preventDefaultHandler(event);
      if (resultDisabled) return;
      if (onClick) onClick(event as any as React.MouseEvent<HTMLButtonElement>);
    },
    [preventDefaultProp, resultDisabled, onClick],
  );

  return (
    <Component
      ref={ref}
      style={style}
      className={cn(
        className,
        commonButtonStyle,
        !resultDisabled && buttonNotDisabledStyles,
        buttonStyleVariants[type],
        buttonSizeStyleVariants[size],
      )}
      disabled={resultDisabled}
      onClick={handleClick}
    >
      {iconLeftElement}
      {noWrap || dots ? (
        <span
          className={cn(
            noWrap && typographyOptionalStyleVariants.noWrap,
            dots && typographyOptionalStyleVariants.textDots,
            inheritAllTextParamsRequiredStyle,
          )}
        >
          {children}
        </span>
      ) : (
        children
      )}
      {iconRightElement}
    </Component>
  );
}

export default React.memo(React.forwardRef(Button)) as ComponentWithRef<ButtonInterface, HTMLButtonElement>;

export type { ButtonType } from "./types";

export { buttonBackgroundVar, buttonTextVar, buttonOutlineBorderVar } from "./style.css";

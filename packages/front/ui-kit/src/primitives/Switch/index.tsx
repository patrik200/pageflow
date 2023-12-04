import React from "react";
import { isReactComponent } from "@worksolutions/react-utils";
import cn from "classnames";

import { inheritAllTextParamsRequiredStyle, typographyOptionalStyleVariants } from "primitives/Typography";

import {
  checkWrapperActiveStyle,
  checkWrapperInactiveStyle,
  contentStyles,
  checkWrapperPositionStyles,
  checkWrapperPositionStyleVariants,
  checkWrapperStyles,
  wrapperActiveStyles,
  wrapperCenterStyles,
  wrapperDisabledStyles,
  wrapperStyles,
  checkStyles,
  checkInactiveStyles,
  checkActiveStyles,
} from "./style.css";

export interface SwitchInterface {
  style?: Record<string, any>;
  className?: string;
  center?: boolean;
  dots?: boolean;
  noWrap?: boolean;
  boxPosition?: keyof typeof checkWrapperPositionStyleVariants;
  value: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onChange: (value: boolean) => void;
  onClick?: (ev: React.SyntheticEvent) => void;
}

// eslint-disable-next-line complexity
function Switch({
  style,
  className,
  center = true,
  dots,
  noWrap,
  boxPosition = "left",
  value,
  disabled = false,
  children,
  onChange,
  onClick,
}: SwitchInterface) {
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;
      onClick?.(event);
      onChange(!value);
    },
    [disabled, onClick, onChange, value],
  );

  const check = (
    <div
      className={cn(
        checkWrapperStyles,
        checkWrapperPositionStyleVariants[boxPosition],
        !center && checkWrapperPositionStyles,
        value ? checkWrapperActiveStyle : checkWrapperInactiveStyle,
      )}
    >
      <div className={cn(checkStyles, value ? checkActiveStyles : checkInactiveStyles)} />
    </div>
  );

  return (
    <div
      style={style}
      className={cn(
        className,
        wrapperStyles,
        center && wrapperCenterStyles,
        disabled ? wrapperDisabledStyles : wrapperActiveStyles,
      )}
      onClick={handleClick}
    >
      {boxPosition === "left" && check}
      {Array.isArray(children) || isReactComponent(children) ? (
        children
      ) : (
        <span
          className={cn(
            contentStyles,
            noWrap && typographyOptionalStyleVariants.noWrap,
            dots && typographyOptionalStyleVariants.textDots,
            inheritAllTextParamsRequiredStyle,
          )}
        >
          {children}
        </span>
      )}
      {boxPosition === "right" && check}
    </div>
  );
}

export default React.memo(Switch);

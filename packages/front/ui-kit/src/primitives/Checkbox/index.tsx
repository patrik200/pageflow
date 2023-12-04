import React from "react";
import { isReactComponent, preventDefaultHandler } from "@worksolutions/react-utils";
import cn from "classnames";

import Icon from "primitives/Icon";
import { inheritAllTextParamsRequiredStyle, typographyOptionalStyleVariants } from "primitives/Typography";

import {
  checkIconWrapperStyle,
  contentStyles,
  iconRadioStyles,
  iconStyles,
  iconWrapperPositionStyles,
  iconWrapperPositionStyleVariants,
  iconWrapperStyles,
  radioIconWrapperStyle,
  wrapperActiveStyles,
  wrapperCenterStyles,
  wrapperDisabledStyles,
  wrapperStyles,
} from "./style.css";

export interface CheckboxInterface {
  style?: Record<string, any>;
  className?: string;
  center?: boolean;
  dots?: boolean;
  noWrap?: boolean;
  boxPosition?: keyof typeof iconWrapperPositionStyleVariants;
  children: React.ReactNode;
  value: boolean;
  disabled?: boolean;
  preventDefault?: boolean;
  radio?: boolean;
  passClickEventOnCheckIconComponent?: boolean;
  onClickEvent?: (event: React.MouseEvent<HTMLElement>) => void;
  onChange?: (value: boolean) => void;
}

// eslint-disable-next-line complexity
function Checkbox({
  style,
  className,
  dots,
  noWrap,
  boxPosition = "left",
  children,
  center = true,
  value,
  disabled,
  preventDefault: preventDefaultProp = true,
  radio,
  passClickEventOnCheckIconComponent,
  onChange,
  onClickEvent,
}: CheckboxInterface) {
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (preventDefaultProp) preventDefaultHandler(event);
      if (disabled) return;
      onChange?.(!value);
      onClickEvent?.(event);
    },
    [preventDefaultProp, disabled, onChange, value, onClickEvent],
  );

  const check = (
    <div
      className={cn(
        iconWrapperStyles,
        iconWrapperPositionStyleVariants[boxPosition],
        !center && iconWrapperPositionStyles,
        radio ? radioIconWrapperStyle : checkIconWrapperStyle,
      )}
      onClick={passClickEventOnCheckIconComponent ? handleClick : undefined}
    >
      {value && (
        <Icon
          className={cn(iconStyles, radio && iconRadioStyles)}
          icon={radio ? "checkboxBlankCircleFill" : "checkLine"}
        />
      )}
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
      onClick={passClickEventOnCheckIconComponent ? undefined : handleClick}
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

export default React.memo(Checkbox);

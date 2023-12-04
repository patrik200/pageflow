import React from "react";
import { isString } from "@worksolutions/utils";
import cn from "classnames";

import Icon, { InternalIcons } from "primitives/Icon";
import Spinner from "primitives/Spinner";

import { ButtonSize } from "../../types";

import {
  customJSXElementIconContainerStyle,
  iconButtonLeftSizeStyleVariants,
  iconButtonRightSizeStyleVariants,
  iconButtonSizeStyleVariants,
  spinnerStyles,
} from "./style.css";

export interface UseButtonElementsInterface {
  content: { iconLeft?: InternalIcons | React.ReactNode; iconRight?: InternalIcons | React.ReactNode };
  wrapCustomJSXIconElementToIconContainer?: boolean;
  hasChildren: boolean;
  loading?: boolean;
  leftIconClassName?: string;
  rightIconClassName?: string;
  size: ButtonSize;
}

export function useButtonElements({
  content: { iconRight, iconLeft },
  loading,
  hasChildren,
  wrapCustomJSXIconElementToIconContainer = true,
  leftIconClassName,
  rightIconClassName,
  size,
}: UseButtonElementsInterface) {
  return {
    iconLeftElement: (
      <ButtonElement
        className={cn(
          leftIconClassName,
          iconButtonSizeStyleVariants[size],
          hasChildren && iconButtonLeftSizeStyleVariants[size],
        )}
        icon={iconLeft}
        loading={loading}
        showSpinnerWhenLoading
        wrapCustomJSXIconElementToIconContainer={wrapCustomJSXIconElementToIconContainer}
      />
    ),
    iconRightElement: (
      <ButtonElement
        className={cn(
          rightIconClassName,
          iconButtonSizeStyleVariants[size],
          hasChildren && iconButtonRightSizeStyleVariants[size],
        )}
        icon={iconRight}
        loading={loading}
        wrapCustomJSXIconElementToIconContainer={wrapCustomJSXIconElementToIconContainer}
      />
    ),
  };
}

function ButtonElement({
  className,
  icon,
  loading,
  showSpinnerWhenLoading,
  wrapCustomJSXIconElementToIconContainer,
}: {
  className?: string;
  icon: InternalIcons | React.ReactNode;
  wrapCustomJSXIconElementToIconContainer: boolean;
  loading: boolean | undefined;
  showSpinnerWhenLoading?: boolean;
}) {
  if (loading && showSpinnerWhenLoading) return <Spinner className={cn(className, spinnerStyles)} />;

  if (!icon) return null;

  if (isString(icon)) return <Icon icon={icon} className={className} />;

  if (wrapCustomJSXIconElementToIconContainer)
    return <div className={cn(className, customJSXElementIconContainerStyle)}>{icon}</div>;

  return <>{icon}</>;
}

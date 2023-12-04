import React from "react";
import cn from "classnames";

import Icon, { InternalIcons } from "primitives/Icon";
import Typography from "primitives/Typography";

import { BadgeColorVariants } from "./variants";

import {
  themeStyleVariants,
  wrapperStyles,
  sizeStyleVariants,
  textStyles,
  iconStyles,
  iconSizeStyleVariants,
  textSizeStyleVariants,
} from "./style.css";

interface BadgeInterface {
  variant: BadgeColorVariants;
  size?: keyof typeof sizeStyleVariants;
  text: string;
  icon?: InternalIcons;
}

function Badge({ variant, size = "default", text, icon }: BadgeInterface) {
  return (
    <div className={cn(wrapperStyles, themeStyleVariants[variant], sizeStyleVariants[size])}>
      {icon && <Icon className={cn(iconStyles, iconSizeStyleVariants[size])} icon={icon} />}
      <Typography className={cn(textStyles, textSizeStyleVariants[size])}>{text}</Typography>
    </div>
  );
}

export default React.memo(Badge);

export * from "./variants";

import React from "react";
import { Icon, InternalIcons, Typography } from "@app/ui-kit";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import { iconStyle, textModeStyleVariants, textStyles, textVariantStyleVariants } from "./style.css";

export type TagTextVariantType = keyof typeof textVariantStyleVariants;
export type TagModeType = keyof typeof textModeStyleVariants;

interface TagInterface {
  className?: string;
  text: string;
  icon?: InternalIcons;
  variant?: TagTextVariantType;
  mode: TagModeType;
}

function Tag({ className, icon, text, variant = "default", mode }: TagInterface, ref: React.Ref<HTMLSpanElement>) {
  return (
    <Typography
      ref={ref}
      className={cn(className, textStyles, textVariantStyleVariants[variant], textModeStyleVariants[mode])}
    >
      {icon && <Icon className={iconStyle} icon={icon} />}
      {text}
    </Typography>
  );
}

export default observer(React.forwardRef(Tag));

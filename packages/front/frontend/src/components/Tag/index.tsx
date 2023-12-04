import React from "react";
import { observer } from "mobx-react-lite";
import { Icon, Typography } from "@app/ui-kit";
import cn from "classnames";

import { alertIconStyle, textModeStyleVariants, textStyles, textVariantStyleVariants } from "./style.css";

export type TagTextVariantType = keyof typeof textVariantStyleVariants;
export type TagModeType = keyof typeof textModeStyleVariants;

interface TagInterface {
  className?: string;
  text: string;
  alert?: boolean;
  variant?: TagTextVariantType;
  mode: TagModeType;
}

function Tag({ className, alert, text, variant = "default", mode }: TagInterface) {
  return (
    <Typography className={cn(className, textStyles, textVariantStyleVariants[variant], textModeStyleVariants[mode])}>
      {alert && <Icon className={alertIconStyle} icon="errorWarningLine" />}
      {text}
    </Typography>
  );
}

export default observer(Tag);

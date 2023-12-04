import React from "react";
import cn from "classnames";

import { dividerCommonStyle, dividerFitStyleVariants, dividerVariants } from "./style.css";

interface DividerInterface {
  className?: string;
  variant?: "horizontal" | "vertical";
  style?: Record<string, any>;
  fit?: boolean;
}

function Divider({ style, className, variant = "horizontal", fit }: DividerInterface) {
  return (
    <div
      style={style}
      className={cn(className, dividerCommonStyle, dividerVariants[variant], fit && dividerFitStyleVariants[variant])}
    />
  );
}

export default React.memo(Divider);

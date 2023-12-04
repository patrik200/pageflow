import React from "react";
import cn from "classnames";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { barStyles, barValueStyles, barValueVar } from "./style.css";

export interface ProgressBarInterface {
  className?: string;
  valueBarClassName?: string;
  value: number;
}

function ProgressBar({ className, valueBarClassName, value }: ProgressBarInterface, ref: React.Ref<HTMLDivElement>) {
  const style = React.useMemo(() => assignInlineVars({ [barValueVar]: value * 100 + "%" }), [value]);

  return (
    <div ref={ref} style={style} className={cn(barStyles, className)}>
      <div className={cn(barValueStyles, valueBarClassName)} />
    </div>
  );
}

export default React.memo(React.forwardRef(ProgressBar));

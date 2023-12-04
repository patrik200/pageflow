import React from "react";
import cn from "classnames";

import { spinnerStyles } from "./common.css";

export interface SpinnerInterface {
  className?: string;
}

function Spinner({ className }: SpinnerInterface) {
  return <div className={cn(className, spinnerStyles)} />;
}

export default React.memo(Spinner);

export * from "./theme.css";

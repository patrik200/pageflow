import React from "react";
import cn from "classnames";

import Typography from "primitives/Typography";

import { requiredAsteriskStyle, typographyStyles } from "./style.css";

export interface InputHeaderInterface {
  required?: boolean;
  children: React.ReactNode;
}

function InputHeader({ required, children }: InputHeaderInterface, ref: React.Ref<HTMLDivElement>) {
  return (
    <Typography ref={ref} className={cn(typographyStyles, required && requiredAsteriskStyle)}>
      {children}
    </Typography>
  );
}

export default React.memo(React.forwardRef(InputHeader));

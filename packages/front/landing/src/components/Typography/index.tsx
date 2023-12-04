import React from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import { typographyStyles } from "./style.css";

interface TypographyInterface {
  className?: string;
  children?: React.ReactNode;
}

function Typography({ className, children }: TypographyInterface) {
  return <span className={cn(typographyStyles, className)}>{children}</span>;
}

export default observer(Typography);

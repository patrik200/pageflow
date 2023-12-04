import React from "react";
import cn from "classnames";

import Typography from "primitives/Typography";

import { titleStyles } from "./style.css";

export interface ModalTitleInterface {
  className?: string;
  children: React.ReactNode;
}

function ModalTitle({ className, children }: ModalTitleInterface) {
  return <Typography className={cn(className, titleStyles)}>{children}</Typography>;
}

export default React.memo(ModalTitle);

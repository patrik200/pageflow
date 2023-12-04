import React from "react";
import cn from "classnames";

import { tableBodyDefaultStyle } from "./style.css";

export interface TableBodyInterface {
  className?: string;
  children: React.ReactNode;
}

function TableBody({ className, children }: TableBodyInterface) {
  return <tbody className={cn(className, tableBodyDefaultStyle)}>{children}</tbody>;
}

export default React.memo(TableBody);

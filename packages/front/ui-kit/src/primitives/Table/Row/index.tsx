import React from "react";
import cn from "classnames";

import { hoverableRowStyle, rowStyles } from "./style.css";

export interface TableRowInterface {
  className?: string;
  children: React.ReactNode;
  href?: string;
  target?: string;
  hoverable?: boolean;
  style?: any;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function TableRow({ className, hoverable, target, href, children, ...props }: TableRowInterface) {
  return (
    <tr {...props} className={cn(className, rowStyles, (hoverable || href) && hoverableRowStyle)}>
      {href
        ? React.Children.toArray(children).map((child) => React.cloneElement(child as any, { href, target }))
        : children}
    </tr>
  );
}

export default React.memo(TableRow);

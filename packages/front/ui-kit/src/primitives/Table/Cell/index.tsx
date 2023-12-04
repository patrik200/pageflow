import React from "react";

import TableCellLink from "./Modes/Link";
import TableCellDefault from "./Modes/Default";

import { cellPositionStyleVariants } from "./style.css";

export interface TableCellInterface {
  outerClassName?: string;
  className?: string;
  disableAutoHeight?: boolean;
  href?: string;
  target?: string;
  position?: keyof typeof cellPositionStyleVariants;
  colspan?: number;
  rowspan?: number;
  children: React.ReactNode;
  onClick?: () => void;
}

function TableCell({ href, target, position = "left", disableAutoHeight = false, ...props }: TableCellInterface) {
  if (href)
    return (
      <TableCellLink href={href} target={target} position={position} disableAutoHeight={disableAutoHeight} {...props} />
    );
  return <TableCellDefault position={position} disableAutoHeight={disableAutoHeight} {...props} />;
}

export default React.memo(TableCell);

export { default as TableCellDefaultText } from "./DefaultText";
export * from "./DefaultText";

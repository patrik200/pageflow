import React from "react";
import cn from "classnames";

import { cellPositionStyleVariants, tableCellBoxStyle, tableCellStyles } from "../../style.css";

import { useAutoHeight } from "./hooks";

interface TableCellDefaultInterface {
  outerClassName?: string;
  className?: string;
  disableAutoHeight: boolean;
  position: keyof typeof cellPositionStyleVariants;
  colspan?: number;
  rowspan?: number;
  children: React.ReactNode;
  onClick?: () => void;
}

function TableCellDefault({
  outerClassName,
  className,
  disableAutoHeight,
  position,
  colspan,
  rowspan,
  children,
  onClick,
}: TableCellDefaultInterface) {
  const setElement = useAutoHeight(disableAutoHeight);
  return (
    <td
      ref={setElement}
      className={cn(tableCellStyles, outerClassName)}
      colSpan={colspan}
      rowSpan={rowspan}
      onClick={onClick}
    >
      <div className={cn(className, tableCellBoxStyle, cellPositionStyleVariants[position])}>{children}</div>
    </td>
  );
}

export default React.memo(TableCellDefault);

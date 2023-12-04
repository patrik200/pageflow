import React from "react";
import cn from "classnames";

import { ComponentWithRef } from "types";

import TableLoading from "./Loading";

import { tableStyle, wrapperStyles } from "./style.css";

export interface TableInterface {
  className?: string;
  loading?: boolean;
  children: React.ReactNode;
}

function Table({ className, loading = false, children }: TableInterface, ref: React.Ref<HTMLTableElement>) {
  const bodiesCountRef = React.useRef(0);
  bodiesCountRef.current = 0;

  return (
    <div className={cn(wrapperStyles, className)}>
      <table ref={ref} className={tableStyle}>
        {children}
      </table>
      <TableLoading loading={loading} />
    </div>
  );
}

export default React.memo(React.forwardRef(Table)) as ComponentWithRef<TableInterface, HTMLTableElement>;

export { default as TableBody } from "./Body";
export type { TableBodyInterface } from "./Body";

export { default as TableCell } from "./Cell";
export * from "./Cell";

export { default as TableHead } from "./Head";
export type { TableHeadInterface } from "./Head";

export { default as TableHeadCell } from "./HeadCell";
export type { TableHeadCellInterface, TableHeadCellAvailableOrder } from "./HeadCell";

export { default as TableRow } from "./Row";
export type { TableRowInterface } from "./Row";

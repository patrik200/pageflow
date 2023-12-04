import React from "react";
import cn from "classnames";

import { useAutoHeight } from "../Default/hooks";
import { cellPositionStyleVariants, tableCellBoxStyle, tableCellStyles } from "../../style.css";

interface TableCellLinkInterface {
  className?: string;
  disableAutoHeight: boolean;
  href: string;
  target?: string;
  position: keyof typeof cellPositionStyleVariants;
  colspan?: number;
  rowspan?: number;
  children: React.ReactNode;
  onClick?: () => void;
}

function TableCellLink({
  className,
  disableAutoHeight,
  href,
  target,
  position,
  colspan,
  rowspan,
  children,
  onClick,
}: TableCellLinkInterface) {
  const setElement = useAutoHeight(disableAutoHeight);

  return (
    <td ref={setElement} className={tableCellStyles} colSpan={colspan} rowSpan={rowspan} onClick={onClick}>
      <a className={cn(className, tableCellBoxStyle, cellPositionStyleVariants[position])} href={href} target={target}>
        {children}
      </a>
    </td>
  );
}

export default React.memo(TableCellLink);

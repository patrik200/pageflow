import React from "react";
import cn from "classnames";

import Typography from "primitives/Typography";
import Icon from "primitives/Icon";

import Cell from "../Cell";

import {
  textStyles,
  iconASCStyles,
  iconDESCStyles,
  iconNoneStyles,
  iconStyles,
  positionStyleVariants,
  cellWithOrderStyles,
  textWithActiveOrderStyles,
  cellStyles,
} from "./style.css";

export type TableHeadCellAvailableOrder = null | "ASC" | "DESC";

export interface TableHeadCellInterface {
  className?: string;
  typographyClassName?: string;
  disabled?: boolean;
  children: React.ReactNode;
  position?: keyof typeof positionStyleVariants;
  colspan?: number;
  rowspan?: number;
  order?: undefined | TableHeadCellAvailableOrder;
  onChangeOrder?: (order: TableHeadCellAvailableOrder) => void;
}

function TableHeadCell({
  className,
  typographyClassName,
  disabled,
  children,
  position = "left",
  colspan,
  rowspan,
  order,
  onChangeOrder,
}: TableHeadCellInterface) {
  const handleClick = React.useCallback(() => {
    if (!onChangeOrder) return;
    if (disabled) return;
    if (order === undefined) return;

    if (!order) {
      onChangeOrder("ASC");
      return;
    }
    if (order === "ASC") {
      onChangeOrder("DESC");
      return;
    }

    onChangeOrder(null);
  }, [onChangeOrder, disabled, order]);

  return (
    <Cell
      className={cn(className, cellStyles, order !== undefined && cellWithOrderStyles)}
      disableAutoHeight
      position={position}
      colspan={colspan}
      rowspan={rowspan}
      onClick={handleClick}
    >
      <Typography
        className={cn(
          textStyles,
          order && textWithActiveOrderStyles,
          positionStyleVariants[position],
          typographyClassName,
        )}
      >
        {children}
        {order !== undefined && (
          <Icon
            className={cn(iconStyles, order ? (order === "DESC" ? iconDESCStyles : iconASCStyles) : iconNoneStyles)}
            icon="arrowUpLine"
          />
        )}
      </Typography>
    </Cell>
  );
}

export default React.memo(TableHeadCell);

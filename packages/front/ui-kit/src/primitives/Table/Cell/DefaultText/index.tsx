import React from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import Typography, { TypographyInterface } from "primitives/Typography";

import { textStyles } from "./style.css";

export type TableCellDefaultTextInterface = TypographyInterface;

function TableCellDefaultText({ className, ...props }: TableCellDefaultTextInterface) {
  return <Typography {...props} className={cn(className, textStyles)} />;
}

export default observer(TableCellDefaultText);

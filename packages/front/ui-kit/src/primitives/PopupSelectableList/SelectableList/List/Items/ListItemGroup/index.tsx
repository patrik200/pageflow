import React from "react";
import cn from "classnames";

import Typography from "primitives/Typography";

import ListItemWrapper, { ListItemWrapperInterface } from "../ListItemWrapper";

import { textStyles, wrapperStyles } from "./style.css";

export type ListItemGroupInterface = Omit<ListItemWrapperInterface, "children" | "onClick" | "selected"> & {
  mainLayout: string;
};

function ListItemGroup({ className, mainLayout }: ListItemGroupInterface) {
  return (
    <ListItemWrapper className={cn(wrapperStyles, className)}>
      <Typography className={textStyles}>{mainLayout}</Typography>
    </ListItemWrapper>
  );
}

export default React.memo(ListItemGroup);

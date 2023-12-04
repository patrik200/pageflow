import React from "react";
import { observer } from "mobx-react-lite";
import { TableCell } from "@app/ui-kit";

import { actionsTableCellWrapperStyles, wrapperSizeStyleVariants } from "./style.css";

interface ActionsTableCellWrapperInterface {
  size: "32" | "92" | "122" | "160";
  children: React.ReactNode;
}

function ActionsTableCell({ size, children }: ActionsTableCellWrapperInterface) {
  return (
    <TableCell position="right" outerClassName={wrapperSizeStyleVariants[size]}>
      <div className={actionsTableCellWrapperStyles}>{children}</div>
    </TableCell>
  );
}

export default observer(ActionsTableCell);

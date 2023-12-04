import React from "react";
import { observer } from "mobx-react-lite";
import { TableCell, TableCellDefaultText, TableRow } from "@app/ui-kit";

interface RowGroupInterface {
  name: string;
  onClick?: () => void;
}

function RowGroup({ name, onClick }: RowGroupInterface) {
  return (
    <TableRow hoverable={!!onClick} onClick={onClick}>
      <TableCell>
        <TableCellDefaultText>{name}</TableCellDefaultText>
      </TableCell>
    </TableRow>
  );
}

export default observer(RowGroup);

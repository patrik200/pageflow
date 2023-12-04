import React from "react";
import { observer } from "mobx-react-lite";
import { TableCellDefaultText } from "@app/ui-kit";
import cn from "classnames";

import FolderIcon from "../FolderIcon";

import { textStyles, wrapperStyles } from "./style.css";

interface FolderRowInterface {
  textClassName?: string;
  beforeFolderIcon?: React.ReactNode;
  title: string;
}

function FolderRow({ textClassName, beforeFolderIcon, title }: FolderRowInterface) {
  return (
    <div className={wrapperStyles}>
      {beforeFolderIcon}
      <FolderIcon />
      <TableCellDefaultText className={cn(textClassName, textStyles)}>{title}</TableCellDefaultText>
    </div>
  );
}

export default observer(FolderRow);

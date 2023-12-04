import React from "react";
import { observer } from "mobx-react-lite";
import { Icon } from "@app/ui-kit";
import cn from "classnames";

import { iconStyles } from "./style.css";

interface FolderIconInterface {
  className?: string;
}

function FolderIcon({ className }: FolderIconInterface) {
  return <Icon className={cn(iconStyles, className)} icon="folder" />;
}

export default observer(FolderIcon);

import React from "react";
import cn from "classnames";

import { listItemWrapperSelectedStyles, listItemWrapperStyle } from "./style.css";

export interface ListItemWrapperInterface {
  style?: Record<string, any>;
  className?: string;
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function ListItemWrapper({ style, className, children, selected, onClick }: ListItemWrapperInterface) {
  return (
    <div
      style={style}
      className={cn(className, listItemWrapperStyle, selected && listItemWrapperSelectedStyles)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default React.memo(ListItemWrapper);

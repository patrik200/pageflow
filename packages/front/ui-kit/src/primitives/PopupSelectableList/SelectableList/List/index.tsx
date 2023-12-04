import React from "react";
import cn from "classnames";

import Scroll, { ScrollInterface } from "primitives/Scroll";

import { scrollStyles } from "./style.css";

export type ListInterface = ScrollInterface;

function List({ className, children, ...props }: ListInterface) {
  return (
    <Scroll className={cn(className, scrollStyles)} {...props}>
      {children}
    </Scroll>
  );
}

export default React.memo(List) as React.FC<ListInterface>;

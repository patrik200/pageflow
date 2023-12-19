import React from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import { cardStyles } from "./style.css";

interface CardInterface {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function Card({ className, children, onClick }: CardInterface) {
  return (
    <div className={cn(className, cardStyles)} onClick={onClick}>
      {children}
    </div>
  );
}

export default observer(Card);

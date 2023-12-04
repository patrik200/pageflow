import React from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import { cardStyles } from "./style.css";

interface CardInterface {
  className?: string;
  children: React.ReactNode;
}

function Card({ className, children }: CardInterface) {
  return <div className={cn(className, cardStyles)}>{children}</div>;
}

export default observer(Card);

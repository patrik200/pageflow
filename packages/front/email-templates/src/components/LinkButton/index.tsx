import React from "react";
import cn from "classnames";

import { buttonStyles } from "./style.css";

interface ButtonInterface {
  className?: string;
  children: React.ReactNode;
  href: string;
}

function LinkButton({ className, children, href }: ButtonInterface) {
  return (
    <a className={cn(buttonStyles, className)} href={href}>
      {children}
    </a>
  );
}

export default React.memo(LinkButton);

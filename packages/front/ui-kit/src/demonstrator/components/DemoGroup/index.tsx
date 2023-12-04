import React from "react";

import Typography from "primitives/Typography";

import { titleStyles, wrapperStyles } from "./style.css";

interface DemoGroupInterface {
  title: string;
  children: React.ReactNode;
}

function DemoGroup({ title, children }: DemoGroupInterface) {
  return (
    <div className={wrapperStyles}>
      <Typography className={titleStyles}>{title}</Typography>
      {children}
    </div>
  );
}

export default React.memo(DemoGroup);

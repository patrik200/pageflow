import React from "react";

import { blockRowWrapperStyles } from "./style.css";

interface PointInterface {
  children: React.ReactNode;
}

function Point({ children }: PointInterface) {
  return (
    <div className={blockRowWrapperStyles}>
      <li />
      <div>{children}</div>
    </div>
  );
}

export default React.memo(Point);

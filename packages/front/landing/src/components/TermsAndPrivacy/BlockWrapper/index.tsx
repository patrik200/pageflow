import React from "react";

import { blockWrapperStyles } from "./style.css";

interface BlockWrapperInterface {
  children: React.ReactNode;
}

function BlockWrapper({ children }: BlockWrapperInterface) {
  return <div className={blockWrapperStyles}>{children}</div>;
}

export default React.memo(BlockWrapper);

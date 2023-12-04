import React from "react";

import { blockTitleStyles } from "./style.css";

interface TitleInterface {
  children: React.ReactNode;
}

function Title({ children }: TitleInterface) {
  return <div className={blockTitleStyles}>{children}</div>;
}

export default React.memo(Title);

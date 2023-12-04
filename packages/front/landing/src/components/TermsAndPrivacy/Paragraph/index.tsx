import React from "react";

import { blockRowWrapperStyles } from "./style.css";

interface ParagraphInterface {
  number: string;
  children: React.ReactNode;
}

function Paragraph({ children, number }: ParagraphInterface) {
  return (
    <div className={blockRowWrapperStyles}>
      <div>{number}</div>
      <div>{children}</div>
    </div>
  );
}

export default React.memo(Paragraph);

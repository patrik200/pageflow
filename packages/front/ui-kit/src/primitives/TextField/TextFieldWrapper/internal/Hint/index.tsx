import React from "react";

import Typography from "primitives/Typography";

import { textStyles } from "./style.css";

interface HintInterface {
  children: React.ReactNode;
}

function Hint({ children }: HintInterface) {
  return <Typography className={textStyles}>{children}</Typography>;
}

export default React.memo(Hint);

import React from "react";
import cn from "classnames";

import Typography from "primitives/Typography";

import { textAbsoluteStyles, textStyles } from "./style.css";

interface ErrorMessageInterface {
  children: React.ReactNode;
  absoluteTemplating: boolean;
}

function ErrorMessage({ children, absoluteTemplating }: ErrorMessageInterface) {
  return <Typography className={cn(textStyles, absoluteTemplating && textAbsoluteStyles)}>{children}</Typography>;
}

export default React.memo(ErrorMessage);

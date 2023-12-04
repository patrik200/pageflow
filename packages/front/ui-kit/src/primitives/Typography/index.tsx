import React from "react";
import cn from "classnames";

import { AsComponent, ComponentWithRef } from "types";

import { typographyCommonStyles } from "./css/common.css";

export interface TypographyInterface {
  className?: string;
  style?: Record<string, string>;
  as?: AsComponent<{}>;
  children?: React.ReactNode;
  asHTML?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

function Typography(
  { as, className, children, asHTML, ...props }: TypographyInterface,
  ref: React.Ref<HTMLSpanElement>,
) {
  const contentProps = asHTML ? { dangerouslySetInnerHTML: { __html: children as any } } : { children };
  const Component = (as || "span") as React.FC<React.JSX.IntrinsicElements["span"]>;
  return <Component ref={ref} className={cn(typographyCommonStyles, className)} {...props} {...contentProps} />;
}

export default React.memo(React.forwardRef(Typography)) as ComponentWithRef<TypographyInterface, HTMLSpanElement>;

export * from "./css/common.css";
export * from "./css/index.css";

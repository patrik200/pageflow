import React from "react";
import cn from "classnames";

import Typography, { TypographyInterface } from "primitives/Typography";

import { AsComponent, ComponentWithRefAndProps } from "types";

import { typographyLinkStyle, typographyLinkThemeVariants } from "./style.css";

type LinkTheme = "primary" | "external";

export type TypographyLinkInterface = {
  as?: AsComponent<{}>;
  linkTheme?: LinkTheme;
  target?: string;
  rel?: string;
} & Omit<TypographyInterface, "as" | "data-id">;

function TypographyLink(
  { className, linkTheme = "primary", children, ...typographyProps }: TypographyLinkInterface,
  ref: React.Ref<HTMLAnchorElement>,
) {
  return (
    <Typography
      ref={ref}
      className={cn(className, typographyLinkStyle, typographyLinkThemeVariants[linkTheme])}
      {...typographyProps}
    >
      {children}
    </Typography>
  );
}

const ForwardedTypographyLink = React.forwardRef(TypographyLink);

export function createTypographyLinkComponent<CUSTOM_PROPS = {}>(
  RootComponent: ComponentWithRefAndProps<Omit<TypographyLinkInterface, "as">, CUSTOM_PROPS, HTMLAnchorElement>,
) {
  const ForwardedRootComponent = React.forwardRef(RootComponent as any);

  const render = (props: TypographyLinkInterface & CUSTOM_PROPS, ref: React.Ref<HTMLAnchorElement>) => (
    <ForwardedTypographyLink {...props} ref={ref} as={ForwardedRootComponent} />
  );

  return React.memo(React.forwardRef(render)) as any as ComponentWithRefAndProps<
    TypographyLinkInterface,
    CUSTOM_PROPS,
    HTMLAnchorElement
  >;
}

export { typographyLinkStyle, typographyLinkThemeVariants } from "./style.css";

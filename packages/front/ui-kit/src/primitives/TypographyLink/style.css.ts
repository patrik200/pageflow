import { style, styleVariants } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

export const typographyLinkStyle = style({
  transition: "200ms color, 200ms opacity",
  textDecoration: "none",
});

export const typographyLinkThemeVariants = styleVariants({
  primary: {},
  external: {
    color: globalThemeColorVars.primary,
    ":hover": { opacity: 0.7 },
  },
});

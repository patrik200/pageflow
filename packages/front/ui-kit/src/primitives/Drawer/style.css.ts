import { style, styleVariants } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

export const appearanceAnimationStyleVariants = styleVariants({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const modalRootStyles = style({
  display: "flex",
  flexDirection: "column",
  background: globalThemeColorVars.modal_root,
});

import { style, styleVariants } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles/theme/index.css";

export const appearanceAnimationStyleVariants = styleVariants({
  from: { opacity: "0" },
  to: { opacity: "1" },
});

export const modalRootStyles = style({
  textAlign: "center",
  background: globalThemeColorVars.modal_root,
});

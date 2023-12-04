import { style, styleVariants } from "@vanilla-extract/css";

export const defaultAppearanceAnimationStyleVariants = styleVariants({
  from: { opacity: "0" },
  to: { opacity: "1" },
});

export const hiddenStyle = style({ display: "none" });

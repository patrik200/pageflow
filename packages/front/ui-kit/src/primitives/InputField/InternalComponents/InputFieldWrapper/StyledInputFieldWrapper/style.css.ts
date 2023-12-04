import { style, styleVariants } from "@vanilla-extract/css";
import { padding } from "polished";
import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  display: "flex",
  alignItems: "center",
  color: globalThemeColorVars.textPrimary,
  border: "1px solid " + globalThemeColorVars.strokeLight,
  background: globalThemeColorVars.backgroundCard,
  transition: "border-color 200ms",
  borderRadius: 8,
});

export const wrapperDisabledStyles = style({ opacity: 0.55 });

export const wrapperTypeDefaultStyleVariants = styleVariants({
  input: { ...padding(null, 16), height: 44, minHeight: 44 },
  textarea: { ...padding(null, 8, null, 16), minHeight: 44 },
});

export const wrapperTypeSmallStyleVariants = styleVariants({
  input: { ...padding(null, 10), height: 34, minHeight: 34 },
  textarea: { ...padding(null, 10, null, 6), minHeight: 34 },
});

export const errorStyle = style({
  borderColor: globalThemeColorVars.red,
});

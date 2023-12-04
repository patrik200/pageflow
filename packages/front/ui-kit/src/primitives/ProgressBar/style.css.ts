import { createVar, fallbackVar, style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

export const barStyles = style({
  height: 4,
  borderRadius: 4,
  position: "relative",
  backgroundColor: globalThemeColorVars.textLabel,
});

export const barValueVar = createVar();

export const barValueStyles = style({
  position: "absolute",
  borderRadius: 4,
  left: 0,
  top: 0,
  bottom: 0,
  width: fallbackVar(barValueVar, "0%"),
  transition: "width 0.1s",
  backgroundColor: globalThemeColorVars.primary,
});

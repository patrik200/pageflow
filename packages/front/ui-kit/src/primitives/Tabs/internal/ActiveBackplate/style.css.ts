import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

export const activeBackplateStyle = style({
  position: "absolute",
  transition: "left 200ms, width 200ms",
  borderBottom: "2px solid " + globalThemeColorVars.primary,
});

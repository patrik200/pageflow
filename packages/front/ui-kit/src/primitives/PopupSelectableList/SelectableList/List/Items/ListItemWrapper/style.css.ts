import { style } from "@vanilla-extract/css";
import { padding } from "polished";
import { globalThemeColorVars } from "styles";

export const listItemWrapperStyle = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  ...padding(6, 16),
});

export const listItemWrapperSelectedStyles = style({
  background: globalThemeColorVars.background,
});

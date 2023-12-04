import { style } from "@vanilla-extract/css";

import { globalThemeColorVars } from "styles";

export const pageWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  background: globalThemeColorVars.background,
  minHeight: "100vh",
});

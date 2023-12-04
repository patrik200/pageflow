import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

export const rowStyles = style({
  position: "relative",
});

export const hoverableRowStyle = style({
  cursor: "pointer",
  transition: "100ms background-color",
  selectors: {
    "&:hover": {
      backgroundColor: globalThemeColorVars.background,
    },
  },
});

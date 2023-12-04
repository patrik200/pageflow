import { style } from "@vanilla-extract/css";
import { size } from "polished";
import { globalThemeColorVars } from "styles/theme/index.css";

export const buttonStyles = style({
  position: "absolute",
  zIndex: 100,
  padding: 8,
  left: "calc(100% + 4px)",
  top: 0,
  background: "transparent",
  borderRadius: 32,
  cursor: "pointer",
  border: "none",
});

export const iconStyles = style({
  ...size(26),
  color: globalThemeColorVars.textInversion,
  borderRadius: "100%",
  padding: 2,
});

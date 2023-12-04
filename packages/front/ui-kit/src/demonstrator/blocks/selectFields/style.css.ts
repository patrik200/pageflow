import { style } from "@vanilla-extract/css";
import { size } from "polished";
import { globalThemeColorVars } from "styles/theme/index.css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginTop: 16,
  marginBottom: 24,
  width: 330,
  alignItems: "flex-start",
});

export const iconStyles = style({
  ...size(8),
  borderRadius: 4,
  background: globalThemeColorVars.red,
});

export const customTextStyles = style({
  color: globalThemeColorVars.primary,
});

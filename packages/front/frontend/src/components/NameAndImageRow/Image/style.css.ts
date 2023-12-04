import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

export const imageStyles = style({
  borderRadius: 30,
  width: 30,
  height: 30,
  flexShrink: 0,
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  objectFit: "cover",
  border: "1px solid " + globalThemeColorVars.strokeLight,
});

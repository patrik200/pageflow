import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

export const containerStyles = style({
  minWidth: 180,
  width: "100%",
  padding: 10,
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  marginBottom: 16,
  gap: 8,
  background: globalThemeColorVars.backgroundCard,
  border: "1px solid " + globalThemeColorVars.strokeLight,
  cursor: "pointer !important",
  flexShrink: 0,
});

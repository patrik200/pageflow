import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";
import { borderRadius } from "polished";

export const toolbarStyles = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 8,
  padding: 8,
  borderBottom: "1px solid " + globalThemeColorVars.strokeLight,
  background: globalThemeColorVars.backgroundCard,
  position: "sticky",
  top: 0,
  ...borderRadius("top", 8),
  zIndex: 1,
});

export const groupStyles = style({
  display: "flex",
  gap: 4,
});

export const dividerStyles = style({
  width: 1,
  height: 22,
  background: globalThemeColorVars.strokeLight,
});

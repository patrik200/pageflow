import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

export const formStyles = style({
  marginBottom: 4,
  flexShrink: 0,
});

export const searchStyles = style({
  border: "none",
  borderBottom: "1px solid " + globalThemeColorVars.strokeLight,
  borderRadius: 0,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
});

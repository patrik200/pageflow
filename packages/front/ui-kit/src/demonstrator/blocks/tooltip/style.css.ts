import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles/theme/index.css";

import { body1regularStyles } from "primitives/Typography/css/index.css";

export const wrapperStyle = style({
  gap: 16,
  overflow: "scroll",
  height: 300,
  padding: 16,
  border: "1px solid " + globalThemeColorVars.background,
  display: "flex",
  flexDirection: "column",
});

export const freeStyles = style({
  height: 100,
  width: "100%",
  border: "1px solid " + globalThemeColorVars.orange,
  flexShrink: 0,
});

export const iconStyles = style({
  cursor: "pointer",
  color: globalThemeColorVars.primary,
  flexShrink: 0,
  width: 16,
  height: 16,
});

export const textStyles = style([body1regularStyles, { maxWidth: 418, minWidth: 300 }]);

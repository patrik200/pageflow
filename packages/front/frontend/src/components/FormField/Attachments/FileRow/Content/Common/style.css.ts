import { style } from "@vanilla-extract/css";
import { body2regularStyles, body3regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  gap: 12,
  alignItems: "center",
  flex: 1,
});

export const formatImageStyles = style({
  width: 32,
  height: 32,
  flexShrink: 0,
});

export const titleWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  flex: 1,
});

export const titleStyles = style([body2regularStyles]);
export const sizeStyles = style([body3regularStyles, { color: globalThemeColorVars.textSecondary }]);

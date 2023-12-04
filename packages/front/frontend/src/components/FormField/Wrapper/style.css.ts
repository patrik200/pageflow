import { style, styleVariants } from "@vanilla-extract/css";
import { body2regularStyles, body3regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
});

export const wrapperDirectionStyleVariants = styleVariants({
  row: { gap: 30 },
  column: { flexDirection: "column", gap: 2 },
});

export const titleStyles = style([body2regularStyles, { color: globalThemeColorVars.textSecondary, flexShrink: 0 }]);

export const requiredAsteriskStyles = style([body2regularStyles, { color: globalThemeColorVars.red, marginLeft: 2 }]);

export const titleDirectionRowStyleVariants = styleVariants({
  view: [body2regularStyles, { width: 200 }],
  edit: [body2regularStyles, { width: 200, paddingTop: 6 }],
});

export const titleDirectionColumnStyleVariants = styleVariants({
  view: [body3regularStyles],
  edit: [body3regularStyles],
});

export const childrenWrapperStyles = style({
  display: "flex",
  gap: 12,
  flex: 1,
});

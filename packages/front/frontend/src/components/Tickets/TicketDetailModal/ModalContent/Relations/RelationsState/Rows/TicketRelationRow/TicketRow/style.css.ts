import { style } from "@vanilla-extract/css";
import { body2regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  alignItems: "center",
  display: "flex",
  gap: 12,
});

export const slugStyles = style([body2regularStyles, { color: globalThemeColorVars.textSecondary }]);

export const nameStyles = style([body2regularStyles, { wordBreak: "break-word" }]);

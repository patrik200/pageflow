import { style } from "@vanilla-extract/css";
import { margin, padding } from "polished";
import { body2regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  borderRadius: 4,
  ...padding(2, 6),
  background: globalThemeColorVars.strokeCard,
  display: "flex",
  alignItems: "center",
  gap: 4,
});

export const typeStyles = style([body2regularStyles, { color: globalThemeColorVars.textSecondary }]);

export const valueStyles = style([body2regularStyles]);

export const deleteIconStyles = style({
  cursor: "pointer",
  padding: 4,
  width: 20,
  height: 20,
  color: globalThemeColorVars.textSecondary,
  ...margin(-2, -2, -2, 0),
});

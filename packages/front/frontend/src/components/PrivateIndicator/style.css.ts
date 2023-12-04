import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

const indicatorStyles = style({
  color: globalThemeColorVars.textSecondary,
  opacity: 0.7,
});

export const indicatorForTableStyles = style([
  indicatorStyles,
  {
    marginBottom: -4,
    marginRight: 8,
    width: 16,
    height: 16,
  },
]);

export const indicatorForDetailStyles = style([
  indicatorStyles,
  {
    marginTop: 7,
    marginRight: 8,
    width: 20,
    height: 20,
  },
]);

export const indicatorForSelectStyles = style([
  indicatorStyles,
  {
    width: 16,
    height: 16,
  },
]);

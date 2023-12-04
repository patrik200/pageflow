import { style, styleVariants } from "@vanilla-extract/css";
import { body2regularStyles, globalThemeColorVars } from "@app/ui-kit";

const indicatorStyles = style({
  color: globalThemeColorVars.textSecondary,
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
    marginTop: 4,
    marginRight: 8,
    width: 24,
    height: 24,
  },
]);

export const indicatorThemeStyleVariants = styleVariants({
  alarm: { color: globalThemeColorVars.red },
  warn: { color: globalThemeColorVars.orange },
});

export const tooltipTextStyles = style([body2regularStyles]);

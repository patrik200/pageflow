import { style } from "@vanilla-extract/css";
import {
  body2regularStyles,
  body3regularStyles,
  globalThemeColorVars,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  flex: 1,
});

export const userRowStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 26,
});

export const roleWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const roleTextStyles = style([body2regularStyles, { color: globalThemeColorVars.textSecondary }]);

export const roleModifierWrapperStyles = style([
  typographyOptionalStyleVariants.noWrap,
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: -14,
    paddingLeft: 90,
  },
]);

export const roleModifierTextStyles = style([body3regularStyles, { color: globalThemeColorVars.textSecondary }]);

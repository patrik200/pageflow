import { style } from "@vanilla-extract/css";
import {
  body2mediumStyles,
  button1mediumStyles,
  globalThemeColorVars,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const titleWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
});

export const titleWrapperDotsStyles = style({
  flex: 1,
  width: 0,
});

export const nameStyles = style([body2mediumStyles]);
export const nameDotsStyles = style([typographyOptionalStyleVariants.textDots]);

export const positionStyles = style([
  button1mediumStyles,
  { color: globalThemeColorVars.textSecondary, marginTop: -2 },
]);

export const positionDotsStyles = style([typographyOptionalStyleVariants.textDots]);

export const nameWithUnavailableIconStyles = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

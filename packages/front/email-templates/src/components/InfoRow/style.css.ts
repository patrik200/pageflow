import { style } from "@vanilla-extract/css";

import { colors } from "templates/__Wrapper/colors";

export const infoRowWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const infoIconStyles = style({
  fill: colors.textSecondary,
  minWidth: 24,
  minHeight: 24,
});

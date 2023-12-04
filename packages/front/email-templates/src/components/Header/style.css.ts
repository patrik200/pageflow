import { style } from "@vanilla-extract/css";

import { colors } from "templates/__Wrapper/colors";

export const headerWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 16,
});

export const headerTextStyles = style({
  fontSize: 24,
  fontWeight: 700,
  lineHeight: "120%",
  color: colors.textPrimary,
});

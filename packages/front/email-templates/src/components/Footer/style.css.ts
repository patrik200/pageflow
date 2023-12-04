import { style } from "@vanilla-extract/css";

import { colors } from "templates/__Wrapper/colors";

export const footerWrapperStyles = style({
  display: "flex",
  justifyContent: "flex-end",
});

export const footerEmailTextStyles = style({
  fontSize: 12,
  lineHeight: "180%",
  letterSpacing: 0.25,
  color: colors.textSecondary,
});

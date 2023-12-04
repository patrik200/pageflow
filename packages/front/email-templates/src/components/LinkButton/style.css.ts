import { style } from "@vanilla-extract/css";
import { padding } from "polished";

import { colors } from "templates/__Wrapper/colors";

export const buttonStyles = style({
  borderRadius: 8,
  border: 0,
  background: colors.primary,
  height: 42,
  ...padding(10, 32),
  color: colors.white,
  lineHeight: "160%",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.25,
  cursor: "pointer",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  maxWidth: "100%",
  overflow: "hidden",
  textDecoration: "none",
  marginTop: 12,
});

import { margin } from "polished";
import { boxShadow } from "@app/ui-kit";
import { globalStyle, style } from "@vanilla-extract/css";

import { colors } from "./__Wrapper/colors";

export const wrapperStyles = style({
  padding: 32,
  borderRadius: 16,
  display: "flex",
  flexDirection: "column",
  gap: 32,
  boxShadow: boxShadow({ y: 3, blur: 10, color: colors.defaultShadow }),
  ...margin(40, null),
  background: colors.white,
  maxWidth: "calc(100vw - 10px)",
});

export const bodyWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
});

export const infoColumnsWrapperStyles = style({
  display: "flex",
  gap: 24,
  maxWidth: "100%",
});

export const leftInfoColumnStyles = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  whiteSpace: "nowrap",
});

export const rightInfoColumnStyles = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  overflow: "hidden",
});

globalStyle(`${rightInfoColumnStyles} *`, {
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  maxWidth: "100%",
});

export const titleTextStyles = style({
  color: colors.textPrimary,
  textAlign: "center",
  fontSize: 16,
  fontWeight: 500,
  lineHeight: "150%",
  letterSpacing: 0.25,
  maxWidth: 400,
});

export const textStyles = style({
  color: colors.textPrimary,
  fontSize: 15,
  fontWeight: 500,
  lineHeight: "150%",
  letterSpacing: 0.25,
});

export const lightTextStyles = style({
  color: colors.textSecondary,
  fontSize: 15,
  fontWeight: 400,
  lineHeight: "150%",
  letterSpacing: 0.25,
});

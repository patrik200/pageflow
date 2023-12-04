import { globalStyle, style } from "@vanilla-extract/css";

import { colors } from "./colors";

export const htmlStyles = style({
  fontSize: 16,
  fontFamily: "Roboto, sans-serif",
  background: colors.background,
});

export const tableStyles = style({
  width: "100%",
});

export const mainContainerStyles = style({
  display: "block",
  margin: "0 auto !important",
});

export const mainContentTableStyles = style({
  width: "100%",
});

globalStyle(`${htmlStyles} *`, {
  boxSizing: "border-box",
  WebkitFontSmoothing: "antialiased",
});

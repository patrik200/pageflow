import { globalStyle, style } from "@vanilla-extract/css";

export const inputStyles = style({});

globalStyle(`${inputStyles} input`, {
  padding: 0,
  margin: 0,
  width: "100%",
  height: "100%",
  outline: "none",
  font: "inherit",
});

export const flagWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  height: 18,
});

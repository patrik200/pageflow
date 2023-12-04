import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

export const tabsContainerStyles = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  flexShrink: 0,
  overflow: "hidden",
  background: "transparent",
  alignSelf: "flex-start",
});

export const tabsContainerFitStyles = style({ width: "auto" });

export const tabsWrapperStyles = style({
  display: "flex",
  width: "100%",
  alignSelf: "flex-start",
});

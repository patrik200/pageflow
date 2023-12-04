import { style } from "@vanilla-extract/css";
import { windowInnerHeightVar } from "styles/init";

export const rootWrapperStyle = style({
  width: "100%",
  margin: "auto",
  display: "flex",
});

export const rightBlockStyle = style({
  flex: 1,
  width: 0,
  minHeight: windowInnerHeightVar,
  paddingTop: 62,
  paddingBottom: 36,
  marginRight: 24,
});

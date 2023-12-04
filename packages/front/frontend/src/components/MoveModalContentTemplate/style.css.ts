import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { windowInnerHeightVar } from "@app/ui-kit";

export const wrapperStyles = style({
  width: 600,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  position: "relative",
  height: calc(windowInnerHeightVar).subtract("180px").toString(),
  maxHeight: 400,
});

export const moveHereButtonWrapperStyles = style({
  marginTop: 20,
  visibility: "hidden",
  flex: 1,
  display: "flex",
  alignItems: "flex-end",
});

export const moveHereButtonWrapperVisibleStyles = style({
  visibility: "visible",
});

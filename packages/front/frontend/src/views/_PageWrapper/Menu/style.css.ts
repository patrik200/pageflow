import { style } from "@vanilla-extract/css";
import { windowInnerHeightVar } from "@app/ui-kit";

export const menuWrapperStyles = style({
  width: 200,
  display: "flex",
  flexDirection: "column",
  gap: 32,
  height: windowInnerHeightVar,
  position: "sticky",
  top: 0,
});

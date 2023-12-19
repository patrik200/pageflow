import { style } from "@vanilla-extract/css";
import { createBreakpointFrom, globalThemeColorVars, windowInnerHeightVar } from "@app/ui-kit";
import { padding } from "polished";

export const pageWrapperStyles = style({
  minHeight: windowInnerHeightVar,
  display: "flex",
  width: "100%",
  background: globalThemeColorVars.background,
  gap: 24,
});

export const childrenWrapperStyles = style({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: 16,
  ...padding(null, null, 76, null),
  "@media": createBreakpointFrom("tablet", {
    ...padding(24, 24, 76, null),
  }),
});

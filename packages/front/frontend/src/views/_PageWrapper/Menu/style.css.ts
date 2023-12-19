import { style } from "@vanilla-extract/css";
import { createBreakpointFrom, windowInnerHeightVar } from "@app/ui-kit";

export const menuWrapperDesktopStyles = style({
  width: 200,
  flexDirection: "column",
  gap: 32,
  height: windowInnerHeightVar,
  position: "sticky",
  top: 0,
  display: "none",
  "@media": {
    ...createBreakpointFrom("tablet", {
      display: "flex",
    }),
  },
});

export const mobileBurgerButtonStyles = style({
  position: "absolute",
  paddingTop: 32,
  "@media": {
    ...createBreakpointFrom("tablet", { display: "none" }),
  },
});

export const menuWrapperMobileStyles = style({
  display: "flex",
  flexDirection: "column",
  height: windowInnerHeightVar,
  justifyContent: "space-between",
  paddingTop: 100,
});

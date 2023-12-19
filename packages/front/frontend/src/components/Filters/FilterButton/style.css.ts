import { createBreakpointFrom } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const filterButtonIconStyles = style({
  transition: "transform 0.2s",
});

export const filterButtonIconOpenedStyles = style({
  transform: "rotateZ(180deg)",
});

export const filterButtonMobileStyles = style({
  "@media": createBreakpointFrom("tablet", {
    display: "none",
  }),
});

export const filterButtonDesktopStyles = style({
  display: "none",
  "@media": createBreakpointFrom("tablet", {
    display: "block",
  }),
});

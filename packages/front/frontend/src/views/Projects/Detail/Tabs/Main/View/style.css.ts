import { createBreakpointFrom } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  gap: 16,
  flexDirection: "column-reverse",
  "@media": createBreakpointFrom("miniDesktop", {
    flexDirection: "row",
  }),
});

export const mainWrapperStyles = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const additionalWrapperStyles = style({
  "@media": {
    ...createBreakpointFrom("desktop", {
      minWidth: 390,
    }),
  },
});

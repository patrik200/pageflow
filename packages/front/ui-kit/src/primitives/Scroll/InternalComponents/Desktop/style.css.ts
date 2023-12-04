import { globalStyle, style } from "@vanilla-extract/css";

export const desktopScrollOuterStyle = style({
  overscrollBehavior: "none",
});

globalStyle(".os-scrollbar", {
  vars: {
    "--os-size": "7px",
  },
});

export const scrollbarBackgroundVar = "--os-handle-bg";
export const scrollbarBackgroundHoverVar = "--os-handle-bg-hover";
export const scrollbarBackgroundActiveVar = "--os-handle-bg-active";

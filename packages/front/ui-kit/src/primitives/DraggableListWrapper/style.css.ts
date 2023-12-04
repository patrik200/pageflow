import { globalStyle, style } from "@vanilla-extract/css";

import { spinnerMedium } from "primitives/Spinner/theme.css";

export const wrapperStyles = style({ position: "relative" });
globalStyle(`${wrapperStyles} > :not(:last-child)`, { transition: "opacity 0.2s, filter 0.2s" });

export const wrapperDisabledStyles = style({});
globalStyle(`${wrapperDisabledStyles} > :not(:last-child)`, { opacity: 0.4, filter: "grayscale(1)" });

export const spinnerStyles = style([
  spinnerMedium.className,
  {
    opacity: 0,
    visibility: "hidden",
    transition: "opacity 0.3s, visibility 0.3s",
    zIndex: 900,
    position: "absolute",
    inset: "50%",
    transform: "translate(-50%, -50%)",
  },
]);

export const spinnerVisibleStyles = style({ opacity: 1, visibility: "visible" });

export const draggableListIsDraggingStyles = style({});

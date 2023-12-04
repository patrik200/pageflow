import { style } from "@vanilla-extract/css";

export const modalRootStyles = style({
  position: "fixed",
  minWidth: "100%",
  minHeight: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 1001,
});

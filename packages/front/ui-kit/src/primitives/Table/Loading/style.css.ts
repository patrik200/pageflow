import { style, styleVariants } from "@vanilla-extract/css";

import { spinnerExtra } from "primitives/Spinner/theme.css";

export const backgroundStyles = style({
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  transition: "opacity 0.2s, visibility 0.2s, backdrop-filter 0.2s",
  zIndex: 10000,
  backdropFilter: "blur(1.3px)",
});

export const spinnerWrapperStyles = style({
  transform: "translate(-50%, -50%)",
  position: "absolute !important" as any,
  left: "50%",
  top: "50%",
  transition: "opacity 0.2s, visibility 0.2s",
  zIndex: 10000,
});

export const spinnerStyle = style([spinnerExtra.className]);

export const appearanceStyleVariants = styleVariants({
  from: { opacity: 0, visibility: "hidden" },
  to: { opacity: 1, visibility: "visible" },
});

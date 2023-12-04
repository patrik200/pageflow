import { style } from "@vanilla-extract/css";

import { body2regularStyles, h3mediumStyles } from "primitives/Typography/css/index.css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const commentStyles = style({
  minWidth: 350,
});

export const runWrapperStyles = style({
  marginTop: 16,
});
export const runStyles = style({
  width: "100%",
});

export const modalWithActionsStyles = style({
  minWidth: 300,
});

export const deleteWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
});
export const deleteScrollStyles = style({ maxHeight: 200 });
export const deleteScrollContentStyles = style({ display: "flex", flexDirection: "column" });
export const deleteStyles = style([h3mediumStyles]);

export const heheStyles = style([body2regularStyles, { padding: 50 }]);

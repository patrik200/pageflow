import { style } from "@vanilla-extract/css";
import { margin, padding } from "polished";

export const cardStyles = style({
  flex: 1,
  display: "flex",
});

export const kanbanCardContentStyles = style({
  flex: 1,
  padding: 16,
});
export const listCardContentStyles = style({
  flex: 1,
  paddingTop: 16,
});

export const kanbanStyles = style({
  ...margin(null, -16, -28, -16),
  ...padding(null, 16, 8, 16),
});

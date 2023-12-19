import { style } from "@vanilla-extract/css";
import { padding } from "polished";

export const projectListStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  ...padding(0, 16),
});

export const projectListItemStyles = style({
  gap: 16,
  ":hover": { cursor: "pointer" },
});

export const projectListItemRowStyles = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

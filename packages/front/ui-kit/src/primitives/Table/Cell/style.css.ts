import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { padding } from "polished";

export const tableCellStyles = style({ verticalAlign: "top" });
export const tableCellBoxStyle = style({
  ...padding(16, null),
  display: "flex",
  flexDirection: "column",
  textDecoration: "none",
});

globalStyle(`${tableCellStyles}:first-child ${tableCellBoxStyle}`, { ...padding(null, 12, null, 20) });
globalStyle(`${tableCellStyles}:last-child ${tableCellBoxStyle}`, { ...padding(null, 20, null, 12) });
globalStyle(`${tableCellStyles}:not(:first-child):not(:last-child) ${tableCellBoxStyle}`, { ...padding(null, 12) });

export const cellPositionStyleVariants = styleVariants({
  left: { alignItems: "flex-start" },
  center: { alignItems: "center" },
  right: { alignItems: "flex-end" },
});

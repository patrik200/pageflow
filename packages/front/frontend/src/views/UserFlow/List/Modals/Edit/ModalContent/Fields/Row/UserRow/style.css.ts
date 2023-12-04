import { style, globalStyle } from "@vanilla-extract/css";
import { padding } from "polished";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "row",
  gap: 10,
});

export const titleRowWrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

const widthField = 240;
export const userFieldStyles = style({
  width: widthField,
});

export const integerFieldStyles = style({
  width: widthField,
});

export const descriptionStyles = style({
  flex: 1,
});
globalStyle(`${descriptionStyles} > div`, { height: 98 });

export const deleteButtonStyles = style({
  ...padding(null, 10),
});

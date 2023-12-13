import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  padding: 10,
});

export const lineStyles = style({
  width: 600,
  height: 2,
  backgroundColor: "blue",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 30,
});

export const pointStyles = style({
  top: "-4px",
  position: "relative",
  width: 10,
  height: 10,
  borderRadius: "50%",
  border: "3px solid blue",
  backgroundColor: "white",
});

import { style } from "@vanilla-extract/css";

import { body2regularStyles } from "primitives/Typography/css/index.css";

import { globalThemeColorVars } from "../../../styles";

export const wrapperStyles = style({
  flexWrap: "wrap",
  gap: "40px 20px",
  display: "flex",
});

export const iconWrapperStyles = style({
  display: "flex",
  justifyContent: "center",
  width: 170,
  flexDirection: "column",
});

export const iconStyles = style({
  width: 24,
  height: 24,
  border: "1px solid " + globalThemeColorVars.strokeLight,
});

export const textStyles = style([
  body2regularStyles,
  {
    marginTop: 4,
  },
]);

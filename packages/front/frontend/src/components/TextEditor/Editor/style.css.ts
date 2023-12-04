import { style } from "@vanilla-extract/css";
import { body2regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const editorContainerStyles = style({
  border: "1px solid " + globalThemeColorVars.strokeLight,
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
});

export const editorStyles = style({
  position: "relative",
});

export const editableInputStyles = style([
  body2regularStyles,
  {
    padding: 12,
    outline: "none",
    minHeight: 130,
  },
]);

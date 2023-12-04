import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles/theme/index.css";

import { buttonBackgroundVar, buttonTextVar } from "primitives/Button/style.css";

export const coloredButtonStyle = style({
  vars: {
    [buttonBackgroundVar]: globalThemeColorVars.green,
    [buttonTextVar]: globalThemeColorVars.yellow,
  },
});

export const wrapperStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 8,
  padding: 40,
});

export const buttonsWrapperStyles = style({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  marginBottom: 4,
});

export const buttonWithMaxWidthStyle = style([{ maxWidth: 165 }]);

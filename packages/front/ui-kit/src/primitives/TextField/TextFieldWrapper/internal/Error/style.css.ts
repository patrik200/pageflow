import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

import { body3regularStyles } from "primitives/Typography/css/index.css";

export const textStyles = style([
  body3regularStyles,
  {
    marginTop: 4,
    color: globalThemeColorVars.red,
  },
]);

export const textAbsoluteStyles = style({
  marginTop: 1,
  top: "100%",
  position: "absolute",
});

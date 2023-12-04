import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles/theme/index.css";

import { h2boldStyles } from "primitives/Typography/css/index.css";

import { boxShadow } from "utils";

export const wrapperStyle = style({
  marginTop: 200,
  display: "flex",
  gap: 16,
});

export const popupComponentStyle = style({
  padding: 12,
  background: globalThemeColorVars.background,
  zIndex: 3,
  boxShadow: boxShadow({ blur: 10, color: globalThemeColorVars.defaultShadow }),
});

export const textStyles = style([h2boldStyles]);

import { globalStyle, style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

import { body1regularStyles } from "primitives/Typography/css/index.css";

export const singleWrapperStyles = style({ marginBottom: 32, width: 32, marginTop: 32 });
export const singleChildrenWrapperStyles = style({});
globalStyle(`${singleChildrenWrapperStyles} > *`, { marginBottom: 16 });

export const itemStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: globalThemeColorVars.green,
});

export const textStyles = style([body1regularStyles, { color: globalThemeColorVars.primary }]);

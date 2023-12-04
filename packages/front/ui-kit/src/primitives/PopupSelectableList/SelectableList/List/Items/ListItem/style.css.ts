import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

import {
  body3regularStyles,
  body2regularStyles,
  typographyOptionalStyleVariants,
} from "primitives/Typography/css/index.css";

export const layoutWrapperStyles = style({
  display: "flex",
  alignItems: "center",
});

export const leftLayoutWrapperStyles = style({
  marginRight: 8,
});

export const rightLayoutWrapperStyles = style({
  marginLeft: 8,
  flex: 1,
  display: "flex",
  justifyContent: "flex-end",
});

export const textsWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
});

export const mainTextStyles = style([body2regularStyles, { color: "inherit" }]);
export const mainTextNoWrapStyles = typographyOptionalStyleVariants.noWrap;

export const selectableListItemWrapperStyle = style({
  cursor: "pointer",
  transition: "opacity 200ms",
  selectors: {
    "&:hover": {
      opacity: 0.6,
    },
  },
});

export const secondaryTextStyles = style([
  body3regularStyles,
  { color: globalThemeColorVars.textSecondary, marginTop: -1 },
]);

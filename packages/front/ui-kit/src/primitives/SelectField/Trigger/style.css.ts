import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { padding } from "polished";

import { body2regularStyles, typographyOptionalStyleVariants } from "primitives/Typography/css/index.css";

export const inputFieldWrapperStyles = style({
  cursor: "pointer",
  height: "unset",
});

export const inputTextWrapperStyles = style({
  flex: 1,
  height: "100%",
  position: "relative",
  display: "grid",
});

export const inputTextWrapperSizeStyleVariants = styleVariants({
  default: { minHeight: 42 },
  small: { minHeight: 32 },
});

export const textStyles = style([
  body2regularStyles,
  {
    color: "inherit",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
]);

export const textSizeStyleVariants = styleVariants({
  default: {
    lineHeight: "21px",
    ...padding(10, null, 9, null),
  },
  small: {
    lineHeight: "18px",
    ...padding(7, null),
  },
});

export const textDotsStyles = style([typographyOptionalStyleVariants.textDots, { display: "inline-block" }]);

export const textPlaceholderStyles = style({ visibility: "hidden", display: "inline-block" });
globalStyle(`${textPlaceholderStyles} > *`, { position: "static" });

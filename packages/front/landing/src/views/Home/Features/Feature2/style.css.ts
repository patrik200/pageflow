import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  marginTop: 170,
  "@media": {
    "screen and (max-width: 768px)": {
      marginTop: 80,
    },
  },
});

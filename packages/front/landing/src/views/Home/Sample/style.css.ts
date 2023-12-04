import { style } from "@vanilla-extract/css";
import { padding } from "polished";

export const wrapperStyles = style({
  width: "100%",
  maxWidth: 850,
  margin: "0 auto",
  marginTop: -100,
  zIndex: 1,

  "@media": {
    "screen and (max-width: 768px)": {
      marginTop: 20,
      ...padding(0, 10),
    },
  },
});

export const imageStyles = style({
  width: "100%",
  borderRadius: 8,
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 32px 64px -16px",
});

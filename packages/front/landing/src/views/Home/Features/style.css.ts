import { style } from "@vanilla-extract/css";

export const featuresWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 24,
  marginTop: 48,

  "@media": {
    "screen and (max-width: 768px)": {
      marginTop: 0,
    },
  },
});

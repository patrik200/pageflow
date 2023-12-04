import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  gap: 64,
  margin: "0 auto",
  marginTop: 140,
  alignItems: "center",

  "@media": {
    "screen and (max-width: 768px)": {
      marginTop: 80,
    },
  },
});

export const titleStyles = style({
  fontSize: 32,
  fontWeight: "600",
  lineHeight: "140%",
  textAlign: "center",

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 24,
    },
  },
});

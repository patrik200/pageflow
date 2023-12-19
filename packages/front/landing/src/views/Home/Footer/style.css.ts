import { style } from "@vanilla-extract/css";

export const footerWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  margin: 24,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 24,
  overflow: "hidden",
  background: "linear-gradient(180deg, #2E4751 0%, #1B2C33 100%)",
  marginTop: 96,
  paddingBottom: 32,

  "@media": {
    "screen and (max-width: 768px)": {
      margin: 16,
      marginTop: 48,
    },
  },
});

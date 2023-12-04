import { style } from "@vanilla-extract/css";

import { globalThemeColorVars } from "styles";

export const blockTitleStyles = style({
  fontSize: 40,
  textAlign: "center",
  width: "100%",
  fontWeight: "600",
  color: globalThemeColorVars.textPrimary,
  marginBottom: 40,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 20,
    },
  },
});

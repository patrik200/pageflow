import { style } from "@vanilla-extract/css";

import { globalThemeColorVars } from "styles";

export const blockRowWrapperStyles = style({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  fontSize: 16,
  lineHeight: "25px",
  color: globalThemeColorVars.textPrimary,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 14,
    },
  },
});

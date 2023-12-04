import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

import { defaultShadow } from "styles/common.css";

export const cardStyles = style({
  background: globalThemeColorVars.backgroundCard,
  borderRadius: 8,
  boxShadow: defaultShadow,
  display: "flex",
  flexDirection: "column",
  padding: 16,
});

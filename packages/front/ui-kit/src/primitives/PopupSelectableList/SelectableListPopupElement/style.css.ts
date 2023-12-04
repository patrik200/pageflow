import { style } from "@vanilla-extract/css";
import { padding } from "polished";
import { globalThemeColorVars } from "styles/theme/index.css";

import { boxShadow } from "utils";

export const selectableListPopupElementStyle = style({
  display: "flex",
  flexDirection: "column",
  borderRadius: 8,
  ...padding(4, null),
  background: globalThemeColorVars.backgroundCard,
  border: "1px solid " + globalThemeColorVars.strokeLight,
  boxShadow: boxShadow({ y: 3, blur: 10, color: globalThemeColorVars.defaultShadow }),
});

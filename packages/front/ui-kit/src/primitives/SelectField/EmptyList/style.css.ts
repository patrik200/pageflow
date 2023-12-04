import { style } from "@vanilla-extract/css";
import { padding } from "polished";
import { globalThemeColorVars } from "styles";

import { body1regularStyles } from "primitives/Typography/css/index.css";

export const emptySearchResultsStyles = style([
  body1regularStyles,
  { textAlign: "center", color: globalThemeColorVars.textSecondary, ...padding(12, 8), margin: "auto" },
]);

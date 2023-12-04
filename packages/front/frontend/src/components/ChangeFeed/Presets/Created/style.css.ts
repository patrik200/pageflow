import { style } from "@vanilla-extract/css";
import { body2mediumStyles, body2regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const titleStyles = style([body2regularStyles, { color: globalThemeColorVars.textSecondary }]);

export const nameStyles = style([body2mediumStyles, { marginLeft: 12 }]);

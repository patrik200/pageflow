import { style } from "@vanilla-extract/css";
import { body2mediumStyles, globalThemeColorVars } from "@app/ui-kit";

export const textStyles = style([body2mediumStyles, { color: globalThemeColorVars.textSecondary }]);

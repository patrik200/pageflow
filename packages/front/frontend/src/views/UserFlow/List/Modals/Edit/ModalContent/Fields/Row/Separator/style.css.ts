import { style } from "@vanilla-extract/css";
import { body1mediumStyles, globalThemeColorVars } from "@app/ui-kit";

export const textStyles = style([body1mediumStyles, { color: globalThemeColorVars.textSecondary }]);

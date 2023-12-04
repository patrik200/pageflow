import { style, styleVariants } from "@vanilla-extract/css";
import {
  body2mediumStyles,
  body2regularStyles,
  globalThemeColorVars,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";
import { padding } from "polished";

export const alertIconStyle = style({
  width: 16,
  height: 16,
  marginBottom: -4,
  marginRight: 4,
});

export const textStyles = style([typographyOptionalStyleVariants.noWrap, { ...padding(2, 6), minHeight: 23 }]);

export const textVariantStyleVariants = styleVariants({
  default: [body2mediumStyles, { borderRadius: 8 }],
  light: [body2regularStyles, { borderRadius: 4 }],
});

export const textModeStyleVariants = styleVariants({
  warning: {
    backgroundColor: globalThemeColorVars.orange10,
    color: globalThemeColorVars.orange,
  },
  softWarning: {
    backgroundColor: globalThemeColorVars.pastelYellow,
    color: globalThemeColorVars.textPrimary,
  },
  error: {
    backgroundColor: globalThemeColorVars.red10,
    color: globalThemeColorVars.red,
  },
  success: {
    backgroundColor: globalThemeColorVars.green10,
    color: globalThemeColorVars.green,
  },
});

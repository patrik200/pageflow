import { style, styleVariants } from "@vanilla-extract/css";
import { body2mediumStyles, globalThemeColorVars } from "@app/ui-kit";
import { padding } from "polished";

export const tagWrapperStyles = style({
  ...padding(5, 8),
  borderBottom: "1px solid",
});

export const tagWrapperStyleVariants = styleVariants({
  warning: {
    background: globalThemeColorVars.orange10,
    borderBottomColor: globalThemeColorVars.orange,
  },
  default: {
    background: globalThemeColorVars.strokeCard,
    borderBottomColor: globalThemeColorVars.strokePrimary,
  },
});

export const tagTextStyles = style([body2mediumStyles]);

export const tagTextStyleVariants = styleVariants({
  warning: {
    color: globalThemeColorVars.orange,
  },
  default: {},
});

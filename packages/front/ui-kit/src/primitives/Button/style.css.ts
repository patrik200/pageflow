import { ComplexStyleRule, createVar, style, styleVariants } from "@vanilla-extract/css";
import { padding } from "polished";
import { globalThemeColorVars } from "styles";

import { body3mediumStyles } from "primitives/Typography/css/index.css";

import { boxShadow } from "utils";

export const buttonBackgroundVar = createVar();
export const buttonTextVar = createVar();
export const buttonOutlineBorderVar = createVar();

const disabledSelector = "&:disabled";
const hoverSelector = `&:active:not(${disabledSelector}), &:hover:not(${disabledSelector})`;

export const commonButtonStyle = style([
  body3mediumStyles,
  {
    position: "relative",
    border: "none",
    outline: "none",
    appearance: "none",
    transition: "all 200ms",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: buttonBackgroundVar,
    color: buttonTextVar,
    fontWeight: 500,
    borderRadius: 8,
    selectors: {
      [hoverSelector]: {
        opacity: 0.8,
      },
      [disabledSelector]: {
        opacity: 0.5,
      },
    },
  },
]);

export const buttonNotDisabledStyles = style({ cursor: "pointer" });

export const buttonSizeStyleVariants = styleVariants({
  EXTRA_SMALL: { ...padding(2, 8), height: 26 },
  SMALL: { ...padding(6, 14), height: 34 },
  MEDIUM: { ...padding(10, 20), height: 42 },
});

const PRIMARY_STYLES: ComplexStyleRule = {
  vars: {
    [buttonBackgroundVar]: globalThemeColorVars.primary,
    [buttonTextVar]: globalThemeColorVars.textInversion,
  },
};

const OUTLINE_STYLES: ComplexStyleRule = {
  vars: {
    [buttonBackgroundVar]: "transparent",
    [buttonTextVar]: globalThemeColorVars.textSecondary,
    [buttonOutlineBorderVar]: globalThemeColorVars.strokeLight,
  },
  boxShadow: boxShadow({
    spread: 1.5,
    inset: true,
    color: buttonOutlineBorderVar,
  }),
};

const WITHOUT_BORDER_STYLES: ComplexStyleRule = {
  vars: {
    [buttonBackgroundVar]: "transparent",
    [buttonTextVar]: globalThemeColorVars.textPrimary,
    [buttonOutlineBorderVar]: "transparent",
  },
};

export const buttonStyleVariants = styleVariants({
  PRIMARY: PRIMARY_STYLES,
  OUTLINE: OUTLINE_STYLES,
  WITHOUT_BORDER: WITHOUT_BORDER_STYLES,
});

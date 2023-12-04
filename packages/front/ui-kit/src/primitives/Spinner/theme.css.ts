import { createTheme, createThemeContract, createVar } from "@vanilla-extract/css";

export const spinnerSizeThemeContract = createThemeContract({ width: null, height: null, borderWidth: null });
export const spinnerColorVar = createVar();
export const spinnerBackgroundColorVar = createVar();

const spinnerSmallVars = { width: "16px", height: "16px", borderWidth: "3px" };
export const spinnerSmall = {
  className: createTheme(spinnerSizeThemeContract, spinnerSmallVars),
  raw: spinnerSmallVars,
};

const spinnerMediumVars = { width: "24px", height: "24px", borderWidth: "3px" };
export const spinnerMedium = {
  className: createTheme(spinnerSizeThemeContract, spinnerMediumVars),
  raw: spinnerMediumVars,
};

const spinnerLargeVars = { width: "32px", height: "32px", borderWidth: "4px" };
export const spinnerLarge = {
  className: createTheme(spinnerSizeThemeContract, spinnerLargeVars),
  raw: spinnerLargeVars,
};

const spinnerExtraVars = { width: "40px", height: "40px", borderWidth: "4px" };
export const spinnerExtra = {
  className: createTheme(spinnerSizeThemeContract, spinnerExtraVars),
  raw: spinnerExtraVars,
};

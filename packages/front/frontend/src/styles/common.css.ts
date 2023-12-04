import { boxShadow, globalThemeColorVars } from "@app/ui-kit";

export const defaultShadow = boxShadow({
  x: 0,
  y: 1,
  blur: 5,
  spread: 0,
  color: globalThemeColorVars.defaultShadow,
});

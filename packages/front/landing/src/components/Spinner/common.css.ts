import { createVar, fallbackVar, keyframes, style } from "@vanilla-extract/css";

import { globalThemeColorVars } from "styles";

const animationKeyframes = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const spinnerBackgroundColorVar = createVar();
export const spinnerColorVar = createVar();

export const spinnerStyles = style([
  {
    display: "inline-block",
    border: "4px solid " + fallbackVar(spinnerBackgroundColorVar, globalThemeColorVars.strokeLight),
    borderTop: "4px solid " + fallbackVar(spinnerColorVar, globalThemeColorVars.primary),
    borderRadius: "50%",
    width: 40,
    height: 40,
    flexShrink: 0,
    animation: `${animationKeyframes} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
  },
]);

import { fallbackVar, keyframes, style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

import { spinnerBackgroundColorVar, spinnerColorVar, spinnerSizeThemeContract } from "./theme.css";

const animationKeyframes = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const spinnerStyles = style([
  {
    display: "inline-block",
    border:
      spinnerSizeThemeContract.borderWidth +
      " solid " +
      fallbackVar(spinnerBackgroundColorVar, globalThemeColorVars.textLabel50),
    borderTop:
      spinnerSizeThemeContract.borderWidth + " solid " + fallbackVar(spinnerColorVar, globalThemeColorVars.primary),
    borderRadius: "50%",
    width: spinnerSizeThemeContract.width,
    height: spinnerSizeThemeContract.height,
    flexShrink: 0,
    animation: `${animationKeyframes} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
  },
]);

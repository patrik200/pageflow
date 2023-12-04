import { globalStyle, style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

import { boxShadow } from "utils";

export const wrapperStyles = style({
  padding: 10,
  borderRadius: 12,
  minHeight: 44,
  backgroundColor: globalThemeColorVars.backgroundCard,
  border: "1px solid " + globalThemeColorVars.strokeLight,
  boxShadow: boxShadow({ y: 3, blur: 10, color: globalThemeColorVars.defaultShadow }),
});

const arrow = `[data-popper-arrow]`;
const arrowBefore = `${arrow}::before`;
const arrowAfter = `${arrow}::after`;

globalStyle(arrow, { backgroundColor: "inherit", zIndex: -1 });

globalStyle(arrowBefore, {
  content: "",
  width: 21,
  height: 21,
  backgroundColor: "inherit",
  transform: `scaleY(0.87) translate(-50%, -50%) rotateZ(45deg)`,
  borderRadius: 2,
  position: "absolute",
  border: "1px solid transparent",
});

globalStyle(arrowAfter, {
  content: "",
  width: 30,
  height: 7,
  background: globalThemeColorVars.backgroundCard,
  position: "absolute",
  left: -15,
  top: -2,
});

function selectorForPlacement(placement: string, type: "arrow" | "before" | "after") {
  return `${wrapperStyles}[data-popper-placement^='${placement}'] ${
    type === "arrow" ? arrow : type === "before" ? arrowBefore : arrowAfter
  }`;
}

globalStyle(selectorForPlacement("top", "arrow"), { bottom: 5 });
globalStyle(selectorForPlacement("top", "before"), {
  borderRightColor: globalThemeColorVars.strokeLight,
  borderBottomColor: globalThemeColorVars.strokeLight,
});
globalStyle(selectorForPlacement("bottom", "arrow"), { top: 2 });
globalStyle(selectorForPlacement("bottom", "before"), {
  borderLeftColor: globalThemeColorVars.strokeLight,
  borderTopColor: globalThemeColorVars.strokeLight,
});

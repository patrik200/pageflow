import { globalStyle, style } from "@vanilla-extract/css";
import { boxShadow, globalThemeColorVars } from "@app/ui-kit";
import { padding } from "polished";

export const popupStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  borderRadius: 8,
  padding: 8,
  background: globalThemeColorVars.backgroundCard,
  border: "1px solid " + globalThemeColorVars.strokeLight,
  boxShadow: boxShadow({ y: 3, blur: 10, color: globalThemeColorVars.defaultShadow }),
});

export const textFieldStyles = style({ width: 190 });
globalStyle(`${textFieldStyles} > *:first-child`, {
  ...padding(null, 8),
  minHeight: 32,
  height: 32,
});
globalStyle(`${textFieldStyles} > *:first-child > * > span:last-child`, {
  top: 15,
});

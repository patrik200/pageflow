import { body2regular, globalThemeColorVars } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const warningIconStyles = style({
  color: globalThemeColorVars.orange,
  alignSelf: "center",
});

export const popupStyles = style([body2regular, { whiteSpace: "nowrap" }]);

export const tooltipStyles = style({
  marginLeft: 5,
});

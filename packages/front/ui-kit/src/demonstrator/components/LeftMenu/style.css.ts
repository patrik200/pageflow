import { style } from "@vanilla-extract/css";
import { margin, padding } from "polished";
import { globalThemeColorVars } from "styles/theme/index.css";

import { body1regularStyles, h4mediumStyles } from "primitives/Typography/css/index.css";

export const wrapperStyle = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  paddingBottom: 8,
});

export const headerStyle = style({
  display: "flex",
  alignItems: "center",
  width: 0,
  ...margin(16, 0, 16, 16),
});

export const headerToggleButtonStyle = style({
  ...padding(8),
});

export const headerToggleButtonOpenedStyles = style({
  transform: "rotateZ(180deg)",
});

export const headerTextStyle = style([h4mediumStyles, { marginLeft: 8 }]);

export const mainStyle = style({
  height: "100%",
  gap: 4,
  transition: "width 0.2s",
  marginLeft: 12,
  overflow: "hidden",
});

export const mainItemStyle = style({
  cursor: "pointer",
  transition: "background 30ms",
  borderRadius: 8,
  ...padding(4, 12),
});
export const mainItemActiveStyle = style({ background: globalThemeColorVars.background });
export const mainItemTextStyle = body1regularStyles;
export const mainItemTextActiveStyle = style({ color: globalThemeColorVars.primary });

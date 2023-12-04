import { style } from "@vanilla-extract/css";
import { padding } from "polished";

import { globalThemeColorVars } from "styles";

export const wrapperStyles = style({
  zIndex: 2,
  width: "100%",
  height: 74,
  background: `linear-gradient(rgb(255, 255, 255), ${globalThemeColorVars.primary0})`,
  position: "sticky",
  top: 0,
});

export const contentStyles = style({
  maxWidth: 1180 + 24 * 2,
  ...padding(null, 24),
  height: "100%",
  display: "flex",
  alignItems: "center",
  margin: "0 auto",
  gap: 16,
});

export const logoImageStyles = style({
  width: 44,
});

export const logoTextStyles = style({
  fontSize: 24,
  fontWeight: "500",
});

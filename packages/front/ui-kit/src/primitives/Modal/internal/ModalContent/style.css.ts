import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { windowInnerHeightVar } from "styles/init";
import { globalThemeColorVars } from "styles/theme/index.css";
import { safeAreaLeft, safeAreaRight } from "styles/consts";

export const modalContentStyle = style({
  display: "inline-flex",
  flexDirection: "column",
  position: "relative",
  verticalAlign: "middle",
  maxHeight: calc(windowInnerHeightVar).subtract("40px").toString(),
  textAlign: "left",
  borderRadius: 24,
  backgroundColor: globalThemeColorVars.backgroundCard,
  border: "1px solid " + globalThemeColorVars.background,
  maxWidth: calc("100%").subtract("80px").subtract(safeAreaLeft).subtract(safeAreaRight).toString(),
  width: "auto",
});

export const scrollStyles = style({ flex: 1 });

export const scrollChildrenWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  padding: 24,
});

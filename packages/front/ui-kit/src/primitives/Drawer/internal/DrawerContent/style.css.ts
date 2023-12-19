import { createVar, fallbackVar, style, styleVariants } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { globalThemeColorVars, createBreakpoint, safeAreaLeft, safeAreaRight } from "styles";

export const drawerWidthVar = createVar();

export const appearanceAnimationLeftStyleVariants = styleVariants({
  from: { transform: "translateX(-100%)" },
  to: { transform: "translateX(0%)" },
});

export const appearanceAnimationRightStyleVariants = styleVariants({
  from: { transform: "translateX(100%)" },
  to: { transform: "translateX(0%)" },
});

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  backgroundColor: globalThemeColorVars.background,
  position: "absolute",
  paddingLeft: safeAreaLeft,
  height: "100%",
  width: fallbackVar(
    drawerWidthVar,
    calc("100%").subtract("68px").subtract(safeAreaLeft).subtract(safeAreaRight).toString(),
  ),
  "@media": {
    ...createBreakpoint("miniDesktop", {
      width: fallbackVar(
        drawerWidthVar,
        calc("100%").subtract("300px").subtract(safeAreaLeft).subtract(safeAreaRight).toString(),
      ),
    }),
  },
});

export const closeIconWrapperStyles = style({
  position: "absolute",
  padding: 8,
  cursor: "pointer",
  color: globalThemeColorVars.background,
  right: 16,
  top: 16,
});

export const scrollStyles = style({
  flex: 1,
  height: 0,
});

export const contentStyles = style({
  display: "flex",
  flexDirection: "column",
  height: "fit-content",
  minHeight: "100%",
});

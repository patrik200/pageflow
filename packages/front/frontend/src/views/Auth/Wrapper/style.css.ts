import { style } from "@vanilla-extract/css";
import { globalThemeColorVars, h1boldStyles, windowInnerHeightVar, createBreakpointFrom } from "@app/ui-kit";
import { padding } from "polished";

export const rootWrapperStyle = style({
  minHeight: windowInnerHeightVar,
  display: "flex",
  justifyContent: "center",
  backgroundSize: "100%",
  backgroundPositionY: "30%",
  "@media": {
    ...createBreakpointFrom("miniDesktop", {
      backgroundImage: "url(/images/auth/background.jpg)",
      justifyContent: "flex-end",
      ...padding(0, 100),
    }),
  },
});

export const contentWrapperStyle = style({
  width: "100%",
  maxWidth: 460,
  display: "flex",
  flexDirection: "column",
  background: globalThemeColorVars.backgroundCard,
  gap: 64,
  ...padding(32, 16),
  "@media": {
    ...createBreakpointFrom("miniDesktop", {
      ...padding(48, 32),
    }),
  },
});

export const logoStyles = style({
  height: 40,
});

export const contentContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: 80,
});

export const titleStyles = style([h1boldStyles]);

export const formContainer = style({
  display: "flex",
  flexDirection: "column",
  flex: 1,
});

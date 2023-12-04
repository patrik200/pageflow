import { globalThemeColorVars, h1boldStyles, spinnerExtra, windowInnerHeightVar } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const rootWrapperStyle = style({
  minHeight: windowInnerHeightVar,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: globalThemeColorVars.background,
  padding: 100,
});

export const contentWrapperStyle = style({
  width: "100%",
  maxWidth: 575,
  display: "flex",
  flexDirection: "column",
  background: globalThemeColorVars.backgroundCard,
  gap: 64,
  padding: 32,
  borderRadius: 12,
});

export const spinnerStyles = style([spinnerExtra.className]);

export const spinnerWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 48,
});

export const formContainer = style({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: 16,
});

export const contentContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: 64,
});

export const titleStyles = style([h1boldStyles]);

export const submitInvitationButton = style({
  marginTop: 16,
});

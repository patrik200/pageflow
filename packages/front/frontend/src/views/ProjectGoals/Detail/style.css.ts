import { body1regularStyles, globalThemeColorVars, h3mediumStyles } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  marginTop: 16,
  marginBottom: 16,
  padding: 10,
});

export const lineWrapperStyles = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-end",
});

export const lineStyles = style({
  width: 600,
  height: 2,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 30,
  backgroundColor: globalThemeColorVars.primary,
});

export const pointStyles = style({
  top: "-4px",
  position: "relative",
  width: 10,
  height: 10,
  borderRadius: "50%",
  border: `3px solid ${globalThemeColorVars.primary}`,
  backgroundColor: "white",
});

export const nameStyles = style([h3mediumStyles, { color: globalThemeColorVars.textPrimary }]);

export const descriptionStyles = style([
  body1regularStyles,
  { color: globalThemeColorVars.textSecondary, marginTop: 10 },
]);

export const buttonStyles = style({
  color: "black",
  marginBottom: 16,
});

export const titleWrapperStyles = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

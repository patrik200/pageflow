import { body1regularStyles, globalThemeColorVars, h3mediumStyles } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  marginTop: 16,
  marginBottom: 16,
  padding: 10,
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
  { color: globalThemeColorVars.textSecondary, marginBottom: 16, marginTop: 10 },
]);

import { style } from "@vanilla-extract/css";

export const wrapperStyles = style({
  display: "flex",
  gap: 16,
});

export const mainCardStyles = style({
  flex: 1,
});

export const additionalCardsWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: 390,
});

export const responsibleCardStyles = style({
  width: "100%",
  gap: 32,
});

export const permissionsCardStyles = style({
  width: "100%",
});

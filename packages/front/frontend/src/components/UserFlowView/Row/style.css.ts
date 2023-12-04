import { style } from "@vanilla-extract/css";
import { subtitle1regularStyles } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});

export const wrapperCompletedStyles = style({
  opacity: 0.4,
});

export const topWrapperStyles = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
});

export const nameStyles = style([subtitle1regularStyles]);

export const usersWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  paddingLeft: 24,
});

export const progressBarWrapperStyles = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

export const progressBarStyles = style({
  width: 55,
});

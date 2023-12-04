import { style } from "@vanilla-extract/css";
import { body3regular, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
});

export const infoStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 2,
  color: globalThemeColorVars.textSecondary,
});

export const infoDeadlineWrapperStyles = style({
  flex: 1,
  display: "flex",
});

export const attachmentsTextStyles = style([
  body3regular,
  {
    color: "inherit",
  },
]);

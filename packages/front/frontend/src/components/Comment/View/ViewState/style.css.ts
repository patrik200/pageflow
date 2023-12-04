import { style } from "@vanilla-extract/css";
import { body3regularStyles, globalThemeColorVars } from "@app/ui-kit";

export const attachmentsWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const bottomWrapperStyles = style({
  display: "flex",
  justifyContent: "flex-end",
});

export const updatedCommentTextStyles = style([body3regularStyles, { color: globalThemeColorVars.textSecondary }]);

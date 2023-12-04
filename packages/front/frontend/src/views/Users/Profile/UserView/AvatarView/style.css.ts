import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const imageStyles = style({
  borderRadius: 8,
  aspectRatio: "1",
  width: 290,
  objectFit: "cover",
});

export const emptyImageStyles = style([
  imageStyles,
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid " + globalThemeColorVars.strokeLight,
  },
]);

export const emptyImageIconStyles = style({
  width: 60,
  height: 60,
  color: globalThemeColorVars.textSecondary,
});

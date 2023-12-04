import { style } from "@vanilla-extract/css";
import { body2mediumStyles, globalThemeColorVars, typographyOptionalStyleVariants } from "@app/ui-kit";
import { padding } from "polished";

export const triggerWrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 6,
  ...padding(4, 8),
  background: globalThemeColorVars.backgroundCard,
  borderRadius: 4,
  height: 26,
  cursor: "pointer",
  transition: "background 0.2s",
  selectors: {
    "&:hover": {
      background: globalThemeColorVars.background,
    },
  },
});

export const triggerTextStyles = style([body2mediumStyles, typographyOptionalStyleVariants.textDots]);

export const triggerIconStyles = style({
  width: 12,
  height: 12,
});

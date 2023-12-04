import { style } from "@vanilla-extract/css";
import { body1regularStyles, globalThemeColorVars, typographyOptionalStyleVariants } from "@app/ui-kit";
import { padding } from "polished";

export const wrapperStyles = style({
  ...padding(2, null),
  background: globalThemeColorVars.backgroundCard,
  display: "flex",
  alignItems: "center",
  gap: 12,
});

const textStyles = style([body1regularStyles, typographyOptionalStyleVariants.textDots]);

export const keyTextStyles = style([textStyles, { flex: 1 }]);
export const valueTextStyles = style([textStyles, { flex: 2.4 }]);

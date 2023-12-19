import { style } from "@vanilla-extract/css";
import { body3regularStyles, globalThemeColorVars, h4mediumStyles } from "@app/ui-kit";
import { padding } from "polished";

export const wrapperStyles = style({
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  ...padding(10, 16),
  flex: 1,
  cursor: "pointer",
  gap: 8,
  transition: "opacity 0.2s",
  background: globalThemeColorVars.backgroundCard,
  border: "1px solid " + globalThemeColorVars.strokeLight,
});

export const disabledStyles = style({
  opacity: 0.5,
});

export const imageStyles = style({
  width: 24,
  height: 24,
});

export const textsWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
});

export const titleStyles = style([h4mediumStyles]);

export const descriptionStyles = style([body3regularStyles, { color: globalThemeColorVars.textSecondary }]);

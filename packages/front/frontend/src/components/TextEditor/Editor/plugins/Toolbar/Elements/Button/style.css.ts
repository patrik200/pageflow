import { style } from "@vanilla-extract/css";
import { boxShadow, globalThemeColorVars } from "@app/ui-kit";

export const buttonStyles = style({
  background: globalThemeColorVars.backgroundCard,
  borderRadius: 4,
  border: "none",
  padding: 5,
  cursor: "pointer",
  width: 26,
  height: 26,
  transition: "background 0.2s, opacity 0.2s, box-shadow 0.2s",
  selectors: {
    "&:hover": {
      background: globalThemeColorVars.background,
    },
  },
});

export const buttonEnabledStyles = style({
  boxShadow: boxShadow({ spread: 2, inset: true, color: globalThemeColorVars.textLabel }),
});

export const buttonDisabledStyles = style({
  opacity: 0.5,
});

export const iconStyles = style({
  width: 16,
  height: 16,
});

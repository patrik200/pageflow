import { globalStyle, style } from "@vanilla-extract/css";
import { body1regularStyles, globalThemeColorVars } from "@app/ui-kit";
import { assignInlineVars } from "@vanilla-extract/dynamic";

export const textStyles = style([body1regularStyles, { whiteSpace: "pre-wrap" }]);

globalStyle(`:root`, {
  vars: assignInlineVars({
    "--toastify-color-success": globalThemeColorVars.green,
    "--toastify-color-warning": globalThemeColorVars.orange,
    "--toastify-color-error": globalThemeColorVars.red,
    "--toastify-color-dark": globalThemeColorVars.background,
    "--toastify-text-color-dark": globalThemeColorVars.textSecondary,
  }),
});

globalStyle(".Toastify__toast", {
  borderRadius: 12,
});

globalStyle(".Toastify__toast-body", {
  alignItems: "flex-start",
});

globalStyle(".Toastify__toast-icon", {
  marginTop: 2,
  marginRight: 12,
});

globalStyle(".Toastify__close-button", {
  color: globalThemeColorVars.textPrimary,
});

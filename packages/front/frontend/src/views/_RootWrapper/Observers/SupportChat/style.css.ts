import { globalStyle } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

globalStyle(`.tf_root_closed`, {
  width: "50px !important",
  height: "50px !important",
  border: "1px solid " + globalThemeColorVars.background,
});

globalStyle(`.tf_root_closed .telegram_feedback_svg`, {
  width: "23px !important",
  height: "23px !important",
});

globalStyle(`#telegram-feedback-root .tf-input`, {
  fontWeight: "300 !important",
});

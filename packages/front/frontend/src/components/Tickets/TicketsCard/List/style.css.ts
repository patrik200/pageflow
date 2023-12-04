import { spinnerExtra } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const spinnerStyles = style([
  spinnerExtra.className,
  {
    margin: 24,
    display: "flex",
    alignSelf: "center",
  },
]);

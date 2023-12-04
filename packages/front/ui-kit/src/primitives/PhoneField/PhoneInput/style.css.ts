import { style, globalStyle } from "@vanilla-extract/css";

import { inputStyles } from "primitives/InputField/InternalComponents/InputFieldNativeInput/style.css";

export const phoneInputStyles = style([inputStyles]);

globalStyle(phoneInputStyles, {
  padding: 0,
  margin: 0,
  width: "100%",
  height: "100%",
  outline: "none",
  font: "inherit",
  background: "transparent",
});

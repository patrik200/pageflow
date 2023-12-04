import { body2regular } from "@app/ui-kit";
import { style } from "@vanilla-extract/css";

export const titleStyles = style([body2regular, { wordBreak: "break-word" }]);

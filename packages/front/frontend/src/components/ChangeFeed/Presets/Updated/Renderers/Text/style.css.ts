import { style } from "@vanilla-extract/css";
import { body2regularStyles } from "@app/ui-kit";

export const textStyles = style([body2regularStyles, { whiteSpace: "pre-wrap", wordBreak: "break-word" }]);

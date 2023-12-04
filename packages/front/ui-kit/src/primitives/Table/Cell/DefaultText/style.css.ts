import { style } from "@vanilla-extract/css";

import { body2regularStyles } from "primitives/Typography/css/index.css";

export const textStyles = style([body2regularStyles, { wordBreak: "break-word" }]);

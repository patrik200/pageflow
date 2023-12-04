import { style } from "@vanilla-extract/css";

import { h2boldStyles } from "primitives/Typography/css/index.css";

export const titleStyles = style([h2boldStyles, { width: "100%", marginBottom: 24 }]);

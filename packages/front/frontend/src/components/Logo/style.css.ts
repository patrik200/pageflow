import { style, styleVariants } from "@vanilla-extract/css";
import { h4mediumStyles } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  gap: 12,
  alignItems: "center",
});

export const logoStyles = style({
  width: 38,
  height: 38,
  flexShrink: 0,
  objectFit: "contain",
  borderRadius: 4,
});

export const clientNameStyles = style([h4mediumStyles, { paddingTop: 4, lineHeight: "105%" }]);

export const clientNameScaleStyleVariants = styleVariants({
  "1": {},
  "2": { fontSize: 19 },
  "3": { fontSize: 18 },
  "4": { fontSize: 17 },
  "5": { fontSize: 16 },
  "6": { fontSize: 15 },
  "7": { fontSize: 14 },
});

import { globalStyle, style } from "@vanilla-extract/css";
import {
  body2medium,
  body2regular,
  body2regularStyles,
  globalThemeColorVars,
  h1boldStyles,
  h2boldStyles,
  h3mediumStyles,
  h4mediumStyles,
} from "@app/ui-kit";
import { padding } from "polished";

export const paragraphStyles = style([body2regularStyles, { color: globalThemeColorVars.textPrimary }]);

export const textBoldStyles = style({ fontWeight: 500 });
export const textItalicStyles = style({ fontStyle: "italic" });
export const textUnderlineStyles = style({ textDecoration: "underline" });
export const textStrikeThroughStyles = style({ textDecoration: "line-through" });
export const textCodeStyles = style({
  fontFamily: body2regular.fontFamily,
  fontWeight: body2regular.fontWeight,
  ...padding(2, 6),
  borderRadius: 4,
  background: globalThemeColorVars.textLabel50,
});

export const orderedListStyles = style({
  paddingLeft: 15,
});
export const unOrderedListStyles = style({
  paddingLeft: 15,
});

export const listStyles = style({
  paddingLeft: 8,
});

export const textH1Styles = style([h1boldStyles, { color: globalThemeColorVars.textPrimary }]);
export const textH2Styles = style([h2boldStyles, { color: globalThemeColorVars.textPrimary }]);
export const textH3Styles = style([h3mediumStyles, { color: globalThemeColorVars.textPrimary }]);
export const textH4Styles = style([h4mediumStyles, { color: globalThemeColorVars.textPrimary }]);

export const imageStyles = style({
  display: "block",
  maxWidth: "100%",
});
globalStyle(`${imageStyles} img`, {
  maxWidth: "100%",
});

export const linkStyles = style({
  fontWeight: body2medium.fontWeight,
  color: globalThemeColorVars.primary,
  textDecoration: "none",
});

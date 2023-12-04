import { EditorThemeClasses } from "lexical";

import {
  imageStyles,
  linkStyles,
  listStyles,
  orderedListStyles,
  paragraphStyles,
  textBoldStyles,
  textCodeStyles,
  textH1Styles,
  textH2Styles,
  textH3Styles,
  textH4Styles,
  textItalicStyles,
  textStrikeThroughStyles,
  textUnderlineStyles,
  unOrderedListStyles,
} from "./style.css";

export const lexicalTheme: EditorThemeClasses = {
  paragraph: paragraphStyles,
  heading: {
    h1: textH1Styles,
    h2: textH2Styles,
    h3: textH3Styles,
    h4: textH4Styles,
  },
  list: {
    ol: orderedListStyles,
    ul: unOrderedListStyles,
    listitem: listStyles,
  },
  image: imageStyles,
  link: linkStyles,
  text: {
    bold: textBoldStyles,
    code: textCodeStyles,
    italic: textItalicStyles,
    strikethrough: textStrikeThroughStyles,
    underline: textUnderlineStyles,
  },
};

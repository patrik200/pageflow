import { globalStyle, style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

export const tableBodyDefaultStyle = style({});

globalStyle(`${tableBodyDefaultStyle} tr td`, { borderTop: "1px solid " + globalThemeColorVars.strokeLight });

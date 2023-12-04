import { style, styleVariants } from "@vanilla-extract/css";
import { Property } from "csstype";

import {
  h1bold,
  h2bold,
  h3medium,
  h4medium,
  body1medium,
  body2medium,
  button1medium,
  body1regular,
  body2regular,
  body3regular,
  subtitle1regular,
  body3medium,
} from "./common.css";

export const typographyOptionalStyleVariants = styleVariants({
  noWrap: { whiteSpace: "nowrap" },
  textDots: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    display: "block",
  },
});

export const inheritAllTextParamsRequiredStyle = style({
  fontWeight: "inherit !important" as Property.FontWeight,
  color: "inherit !important",
  fontSize: "inherit !important",
  letterSpacing: "inherit !important",
  lineHeight: "inherit !important",
});

export const h1boldStyles = style(h1bold);
export const h2boldStyles = style(h2bold);
export const h3mediumStyles = style(h3medium);
export const h4mediumStyles = style(h4medium);
export const body1mediumStyles = style(body1medium);
export const body2mediumStyles = style(body2medium);
export const body3mediumStyles = style(body3medium);
export const button1mediumStyles = style(button1medium);
export const body1regularStyles = style(body1regular);
export const body2regularStyles = style(body2regular);
export const body3regularStyles = style(body3regular);
export const subtitle1regularStyles = style(subtitle1regular);

import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "styles";

import { buildTypographyVariant } from "./typographyStylesBuilder";

export const typographyCommonStyles = style({ color: globalThemeColorVars.textPrimary, display: "inline-block" });

export const h1bold = buildTypographyVariant(36, "110%", 700);
export const h2bold = buildTypographyVariant(26, "120%", 700);

export const h3medium = buildTypographyVariant(23, "120%", 500);
export const h4medium = buildTypographyVariant(20, "130%", 500);
export const body1medium = buildTypographyVariant(16, "140%", 500);
export const body2medium = buildTypographyVariant(14, "130%", 500);
export const body3medium = buildTypographyVariant(12, "150%", 500);
export const button1medium = buildTypographyVariant(10, "160%", 500);

export const body1regular = buildTypographyVariant(16, "140%", 400);
export const body2regular = buildTypographyVariant(14, "130%", 400);
export const body3regular = buildTypographyVariant(12, "150%", 400);
export const subtitle1regular = buildTypographyVariant(14, "160%", 400);

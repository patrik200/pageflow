import React from "react";

import {
  Typography,
  createTypographyLinkComponent,
  h1boldStyles,
  h2boldStyles,
  h3mediumStyles,
  h4mediumStyles,
  body1mediumStyles,
  body2mediumStyles,
  button1mediumStyles,
  body1regularStyles,
  body2regularStyles,
  body3regularStyles,
  subtitle1regularStyles,
  body3mediumStyles,
} from "main";

import { block1Styles, wrapperStyles } from "./style.css";

export const CustomLink = createTypographyLinkComponent<{ href: string }>((props, ref) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a {...(props as any)} ref={ref} />
));

export function TypographyDemo() {
  return (
    <div className={wrapperStyles}>
      <div className={block1Styles}>
        <Typography className={h1boldStyles}>h1bold</Typography>
        <Typography className={h2boldStyles}>h2bold</Typography>
        <Typography className={h3mediumStyles}>h3medium</Typography>
        <Typography className={h4mediumStyles}>h4medium</Typography>
        <Typography className={body1mediumStyles}>body1medium</Typography>
        <Typography className={body2mediumStyles}>body2medium</Typography>
        <Typography className={body3mediumStyles}>body3medium</Typography>
        <Typography className={button1mediumStyles}>button1medium</Typography>
        <Typography className={body1regularStyles}>body1regular</Typography>
        <Typography className={body2regularStyles}>body2regular</Typography>
        <Typography className={body3regularStyles}>body3regular</Typography>
        <Typography className={subtitle1regularStyles}>subtitle1regular</Typography>
      </div>
      <div className={block1Styles}>
        <CustomLink className={body1regularStyles} linkTheme="primary" href="/">
          Primary link
        </CustomLink>
        <CustomLink className={body1regularStyles} linkTheme="external" href="/">
          External link
        </CustomLink>
      </div>
    </div>
  );
}

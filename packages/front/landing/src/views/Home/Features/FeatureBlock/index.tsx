import React from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@app/front-kit";
import cn from "classnames";
import { Icon } from "@app/ui-kit";

import Typography from "components/Typography";

import {
  imageStyles,
  desktopOnlyImageStyles,
  mobileOnlyImageStyles,
  numberStyles,
  textWrapperStyles,
  titleStyles,
  wrapperStyles,
  lightWrapperStyles,
  contentStyles,
  bodyStyles,
  captionWrapperStyles,
  iconStyles,
  captionStyles,
  captionLightWrapperStyles,
  numberWrapperStyles,
  numberBackgroundWrapperStyles,
  lightNumberBackgroundWrapperStyles,
} from "./style.css";

export interface FeatureBlockInterface {
  number: number;
  title: string;
  body: string;
  caption: string;
  light: boolean;
  image: string;
  imageOnRightSide: boolean;
}

function FeatureBlock({ number, light, title, body, caption, image, imageOnRightSide }: FeatureBlockInterface) {
  return (
    <div className={cn(wrapperStyles, light && lightWrapperStyles)}>
      <div className={contentStyles}>
        {!imageOnRightSide && <Image className={cn(desktopOnlyImageStyles, imageStyles)} src={image} />}
        <div className={textWrapperStyles}>
          <div className={numberWrapperStyles}>
            <Typography className={numberStyles}>0{number}</Typography>
            <div className={cn(numberBackgroundWrapperStyles, light && lightNumberBackgroundWrapperStyles)} />
          </div>
          <Typography className={titleStyles}>{title}</Typography>
          <Typography className={bodyStyles}>{body}</Typography>
          <div className={cn(captionWrapperStyles, light && captionLightWrapperStyles)}>
            <Icon className={iconStyles} icon="errorWarningLine" />
            <Typography className={captionStyles}>{caption}</Typography>
          </div>
        </div>
        {!imageOnRightSide && <Image className={cn(mobileOnlyImageStyles, imageStyles)} src={image} />}
        {imageOnRightSide && <Image className={cn(imageStyles)} src={image} />}
      </div>
    </div>
  );
}

export default observer(FeatureBlock);

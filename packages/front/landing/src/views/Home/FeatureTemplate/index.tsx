import React from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@app/front-kit";
import cn from "classnames";

import Typography from "components/Typography";

import {
  imageStyles,
  desktopOnlyImageStyles,
  mobileOnlyImageStyles,
  preTitleStyles,
  textStyles,
  textWrapperStyles,
  titleStyles,
  wrapperStyles,
  imageSizeStyleVariants,
} from "./style.css";

export interface FeatureTemplateInterface {
  className?: string;
  number: number;
  title: string;
  description: string;
  image: string;
  imagePosition: "left" | "right";
  imageSize: keyof typeof imageSizeStyleVariants;
}

function FeatureTemplate({
  className,
  number,
  title,
  description,
  image,
  imagePosition,
  imageSize,
}: FeatureTemplateInterface) {
  return (
    <div className={cn(wrapperStyles, className)}>
      {imagePosition === "left" && (
        <Image className={cn(desktopOnlyImageStyles, imageSizeStyleVariants[imageSize], imageStyles)} src={image} />
      )}
      <div className={textWrapperStyles}>
        <Typography className={preTitleStyles}>№{number}</Typography>
        <Typography className={titleStyles}>{title}</Typography>
        <Typography className={textStyles}>{description}</Typography>
      </div>
      {imagePosition === "left" && (
        <Image className={cn(mobileOnlyImageStyles, imageSizeStyleVariants[imageSize], imageStyles)} src={image} />
      )}
      {imagePosition === "right" && (
        <Image className={cn(imageSizeStyleVariants[imageSize], imageStyles)} src={image} />
      )}
    </div>
  );
}

export default observer(FeatureTemplate);

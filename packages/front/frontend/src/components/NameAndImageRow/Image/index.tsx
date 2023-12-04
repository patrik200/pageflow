import React from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@app/front-kit";

import { FileEntity } from "core/entities/file";

import { imageStyles } from "./style.css";

interface NameAndImageRowImageInterface {
  image?: FileEntity | null;
  imageFallback?: React.ReactNode;
}

function NameAndImageRowImage({ image, imageFallback }: NameAndImageRowImageInterface) {
  if (image) return <Image className={imageStyles} src={image.urlWidth100} />;
  if (imageFallback) return <div className={imageStyles}>{imageFallback}</div>;
  return null;
}

export default observer(NameAndImageRowImage);

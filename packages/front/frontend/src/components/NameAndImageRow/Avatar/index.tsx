import React from "react";
import { observer } from "mobx-react-lite";

import { FileEntity } from "core/entities/file";

import NameAndImageRowImage from "../Image";
import NameAndImageRowImageFallback from "../ImageFallback";

interface NameAndImageRowAvatarInterface {
  name: string;
  image?: FileEntity | null;
}

function NameAndImageRowAvatar({ image, name }: NameAndImageRowAvatarInterface) {
  return <NameAndImageRowImage image={image} imageFallback={<NameAndImageRowImageFallback name={name} />} />;
}

export default observer(NameAndImageRowAvatar);

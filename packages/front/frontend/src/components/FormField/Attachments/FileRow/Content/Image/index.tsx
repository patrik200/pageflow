import React from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@app/front-kit";

import { EditableFileEntity } from "core/entities/file";

import { imageStyles, wrapperStyles } from "./style.css";

interface FileRowContentImageInterface {
  entity: EditableFileEntity;
}

function FileRowContentImage({ entity }: FileRowContentImageInterface) {
  return (
    <div className={wrapperStyles}>
      <Image className={imageStyles} src={entity.url} />
    </div>
  );
}

export default observer(FileRowContentImage);

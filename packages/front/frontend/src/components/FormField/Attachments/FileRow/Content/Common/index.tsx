import React from "react";
import { observer } from "mobx-react-lite";
import { Image, useTranslation } from "@app/front-kit";
import { Typography } from "@app/ui-kit";
import { convertBytesToHumanReadableFormat } from "@worksolutions/utils";

import { EditableFileEntity } from "core/entities/file";

import { getFormatImageByFileName } from "../../libs";

import { formatImageStyles, sizeStyles, titleStyles, titleWrapperStyles, wrapperStyles } from "./style.css";

interface FileRowContentCommonInterface {
  entity: EditableFileEntity;
}

function FileRowContentCommon({ entity }: FileRowContentCommonInterface) {
  const { t } = useTranslation();

  return (
    <div className={wrapperStyles}>
      <Image className={formatImageStyles} src={getFormatImageByFileName(entity.fileName)} />
      <div className={titleWrapperStyles}>
        <Typography className={titleStyles}>{entity.fileName}</Typography>
        <Typography className={sizeStyles}>
          {convertBytesToHumanReadableFormat(entity.size, [
            t({ scope: "file_size_units", name: "b" }),
            t({ scope: "file_size_units", name: "kb" }),
            t({ scope: "file_size_units", name: "mb" }),
            t({ scope: "file_size_units", name: "gb" }),
          ])}
        </Typography>
      </div>
    </div>
  );
}

export default observer(FileRowContentCommon);

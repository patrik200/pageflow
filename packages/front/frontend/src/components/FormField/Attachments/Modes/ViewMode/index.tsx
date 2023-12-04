import React from "react";
import { observer } from "mobx-react-lite";
import { FileInterface } from "@worksolutions/utils";

import { FileEntity } from "core/entities/file";

import FileRow from "../../FileRow";

interface AttachmentsViewModeInterface {
  value: (FileInterface | FileEntity)[];
}

function AttachmentsViewModeMultiply({ value }: AttachmentsViewModeInterface) {
  return (
    <>
      {value.map((file, key) => (
        <FileRow key={key} file={file} edit={false} />
      ))}
    </>
  );
}

export default observer(AttachmentsViewModeMultiply);

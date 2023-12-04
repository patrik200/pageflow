import React from "react";
import { observer } from "mobx-react-lite";
import { FileInterface, isNumber } from "@worksolutions/utils";
import { Button, ProgressBar } from "@app/ui-kit";

import { Link } from "components/Link";

import { EditableFileEntity, FileEntity } from "core/entities/file";

import { getPresetByFileName } from "./libs";
import FileRowContentCommon from "./Content/Common";
import FileRowContentImage from "./Content/Image";

import { contentWrapperStyles, removeButtonIconStyles, removeButtonStyles, wrapperStyles } from "./style.css";

interface FileRowInterface {
  file: FileInterface | FileEntity;
  edit: boolean;
  progress?: number;
  disabled?: boolean;
  onDelete?: () => void;
}

function FileRow({ file, edit, disabled, progress, onDelete }: FileRowInterface) {
  const content = (
    <div className={wrapperStyles}>
      <div className={contentWrapperStyles}>
        {FileEntity.isFileEntity(file) ? <Content file={file} /> : <Content file={file} />}
        {edit
          ? !disabled && (
              <Button
                leftIconClassName={removeButtonIconStyles}
                className={removeButtonStyles}
                size="SMALL"
                type="WITHOUT_BORDER"
                iconLeft="closeLine"
                onClick={onDelete}
              />
            )
          : FileEntity.isFileEntity(file) && (
              <Button size="SMALL" type="WITHOUT_BORDER" iconLeft="downloadFill" preventDefault={false} />
            )}
      </div>
      {isNumber(progress) && <ProgressBar value={progress} />}
    </div>
  );

  if (FileEntity.isFileEntity(file)) {
    return (
      <Link href={file.url} download={file.fileName}>
        {content}
      </Link>
    );
  }

  return content;
}

export default observer(FileRow);

function Content({ file }: { file: FileInterface | FileEntity }) {
  const entity = React.useMemo(() => EditableFileEntity.build(file), [file]);
  const preset = getPresetByFileName(entity.fileName);
  if (preset === "image") return <FileRowContentImage entity={entity} />;
  return <FileRowContentCommon entity={entity} />;
}

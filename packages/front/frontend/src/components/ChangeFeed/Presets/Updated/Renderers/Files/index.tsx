import React from "react";
import { Icon, Typography } from "@app/ui-kit";

import {
  deletedFileNameStyles,
  fileWrapperStyles,
  newFileIconStyles,
  newFileNameStyles,
  wrapperStyles,
} from "./style.css";

interface FilesRendererInterface {
  value: string[] | null;
  mode: "from" | "to";
}

function FilesRenderer({ value, mode }: FilesRendererInterface) {
  if (!value) return null;

  return (
    <div className={wrapperStyles}>
      {mode === "from" &&
        value.map((file, key) => (
          <div key={key} className={fileWrapperStyles}>
            <Typography className={deletedFileNameStyles}>{file}</Typography>
          </div>
        ))}
      {mode === "to" &&
        value.map((file, key) => (
          <div key={key} className={fileWrapperStyles}>
            <Typography className={newFileNameStyles}>{file}</Typography>
            <Icon className={newFileIconStyles} icon="uploadCloudLine" />
          </div>
        ))}
    </div>
  );
}

const FilesRendererDefault = React.memo(FilesRenderer);
(FilesRendererDefault as any).hideSeparator = true;

export default FilesRendererDefault;

import React from "react";
import { observer } from "mobx-react-lite";
import { useFileSelector, useMemoizeCallback } from "@worksolutions/react-utils";
import { Button, PopupManagerMode, Tooltip, Typography } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import { identity } from "@worksolutions/utils";

import { EditableFileEntity } from "core/entities/file";

import FileRow from "../../FileRow";

import { addButtonWrapperStyles, disabledTooltipTextStyles } from "./style.css";

interface AttachmentsEditModeInterface {
  value: EditableFileEntity[];
  disabled?: boolean;
  disabledTooltipText?: string;
  onAdd: (files: EditableFileEntity[]) => void;
  onDelete: (index: number) => void;
}

function AttachmentsEditModeMultiply({
  value,
  disabled,
  disabledTooltipText,
  onAdd,
  onDelete,
}: AttachmentsEditModeInterface) {
  const { t } = useTranslation();

  const { openNativeFileDialog } = useFileSelector(
    React.useCallback((files) => onAdd(files.map((file) => EditableFileEntity.build(file))), [onAdd]),
    { multiply: true },
  );

  const handleDeleteFabric = useMemoizeCallback((id: number) => () => onDelete(id), [onDelete], identity);

  const button = (
    <div className={addButtonWrapperStyles}>
      <Button disabled={disabled} type="WITHOUT_BORDER" size="SMALL" iconLeft="plusLine" onClick={openNativeFileDialog}>
        {t({ scope: "common:common_form_fields", place: "attachments", name: "add_files" })}
      </Button>
    </div>
  );

  return (
    <>
      {value.map((file, key) => (
        <FileRow
          key={key}
          file={file.entity}
          progress={file.progress}
          edit
          disabled={disabled}
          onDelete={handleDeleteFabric(key)}
        />
      ))}
      {disabled && disabledTooltipText ? (
        <Tooltip
          triggerElement={button}
          mode={PopupManagerMode.HOVER}
          primaryPlacement="bottom"
          offset={8}
          popupElement={<Typography className={disabledTooltipTextStyles}>{disabledTooltipText}</Typography>}
        />
      ) : (
        button
      )}
    </>
  );
}

export default observer(AttachmentsEditModeMultiply);

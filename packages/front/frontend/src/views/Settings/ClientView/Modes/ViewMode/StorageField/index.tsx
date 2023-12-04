import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { ProgressBar, Typography } from "@app/ui-kit";
import { convertBytesToHumanReadableFormat } from "@worksolutions/utils";

import FormFieldWrapper, { FormFieldWrapperDirection } from "components/FormField/Wrapper";

import { ClientStorageEntity } from "core/entities/client";

import { storageTextStyles, storageTextWrapperStyles, storageWrapperStyles } from "./style.css";

interface FormFieldStorageInterface {
  direction?: FormFieldWrapperDirection;
  title: string;
  storage: ClientStorageEntity;
}

function FormFieldStorage({ direction, title, storage }: FormFieldStorageInterface) {
  const { t } = useTranslation("settings");

  return (
    <FormFieldWrapper title={title} direction={direction} mode="view">
      <div className={storageWrapperStyles}>
        <div className={storageTextWrapperStyles}>
          <Typography className={storageTextStyles}>
            {convertBytesToHumanReadableFormat(storage.usedFileSize, [
              t({ scope: "common:file_size_units", name: "b" }),
              t({ scope: "common:file_size_units", name: "kb" }),
              t({ scope: "common:file_size_units", name: "mb" }),
              t({ scope: "common:file_size_units", name: "gb" }),
            ])}
          </Typography>
          {storage.haveFilesMemoryLimit && (
            <Typography className={storageTextStyles}>
              {convertBytesToHumanReadableFormat(storage.filesMemoryLimit, [
                t({ scope: "common:file_size_units", name: "b" }),
                t({ scope: "common:file_size_units", name: "kb" }),
                t({ scope: "common:file_size_units", name: "mb" }),
                t({ scope: "common:file_size_units", name: "gb" }),
              ])}
            </Typography>
          )}
        </div>
        {storage.haveFilesMemoryLimit && <ProgressBar value={storage.percentsOfUsedSize} />}
      </div>
    </FormFieldWrapper>
  );
}

export default observer(FormFieldStorage);

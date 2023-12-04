import React from "react";
import { observer } from "mobx-react-lite";
import { Button, ProgressBar } from "@app/ui-kit";
import { Image, useTranslation } from "@app/front-kit";
import { AcceptTypes, FileInterface } from "@worksolutions/utils";
import { useFileSelector } from "@worksolutions/react-utils";

import { EditableFileEntity, FileEntity } from "core/entities/file";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";
import { FormFieldTextEmptyView } from "../Text";

import { actionsWrapperStyles, contentStyles, editWrapperStyles, imageStyleVariants } from "./style.css";

type FormFieldImageEditPart = {
  edit: true;
  errorMessage?: string;
  disabled?: boolean;
  onChange: (entity: EditableFileEntity | null) => void;
};

type FormFieldImageInterface = {
  direction?: FormFieldWrapperDirection;
  title: string;
  value: FileEntity | EditableFileEntity | null;
} & (FormFieldImageEditPart | { view: true });

function FormFieldImage({ direction, title, value, ...props }: FormFieldImageInterface) {
  const { t } = useTranslation();

  const { openNativeFileDialog } = useFileSelector(
    React.useCallback(
      (file: FileInterface) => (props as FormFieldImageEditPart).onChange(EditableFileEntity.build(file)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [(props as FormFieldImageEditPart).onChange],
    ),
    React.useMemo(() => ({ multiply: false, acceptTypes: [AcceptTypes.IMAGE] }), []),
  );

  const handleDeleteFile = React.useCallback(
    () => (props as FormFieldImageEditPart).onChange(null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [(props as FormFieldImageEditPart).onChange],
  );

  return (
    <FormFieldWrapper title={title} direction={direction} mode={"edit" in props ? "edit" : "view"}>
      {"edit" in props ? (
        <div className={editWrapperStyles}>
          <div className={contentStyles}>
            {value && <Image className={imageStyleVariants.edit} src={value.url} />}
            <div className={actionsWrapperStyles}>
              {value && (
                <Button disabled={props.disabled} size="SMALL" type="OUTLINE" onClick={openNativeFileDialog}>
                  {t({ scope: "common_form_fields", place: "image", name: "update" })}
                </Button>
              )}
              {value && (
                <Button disabled={props.disabled} size="SMALL" type="OUTLINE" onClick={handleDeleteFile}>
                  {t({ scope: "common_form_fields", place: "image", name: "delete" })}
                </Button>
              )}
              {!value && (
                <Button disabled={props.disabled} size="SMALL" type="OUTLINE" onClick={openNativeFileDialog}>
                  {t({ scope: "common_form_fields", place: "image", name: "create" })}
                </Button>
              )}
            </div>
          </div>
          {value && EditableFileEntity.isEditableFileEntity(value) && value.progress !== undefined && (
            <ProgressBar value={value.progress} />
          )}
        </div>
      ) : value ? (
        <Image className={imageStyleVariants.view} src={value.url} />
      ) : (
        <FormFieldTextEmptyView />
      )}
    </FormFieldWrapper>
  );
}

export default observer(FormFieldImage);

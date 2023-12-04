import React from "react";
import { observer } from "mobx-react-lite";
import { FileInterface } from "@worksolutions/utils";

import { FileEntity, EditableFileEntity } from "core/entities/file";

import FormFieldWrapper, { FormFieldWrapperDirection } from "../Wrapper";
import { FormFieldTextEmptyView } from "../Text";
import AttachmentsEditModeMultiply from "./Modes/EditMode";
import AttachmentsViewModeMultiply from "./Modes/ViewMode";

import { wrapperStyles } from "./style.css";

type FormFieldAttachmentsInterface = {
  required?: boolean;
  direction?: FormFieldWrapperDirection;
  title: string;
} & (
  | {
      edit: true;
      value: EditableFileEntity[];
      disabled?: boolean;
      disabledTooltipText?: string;
      onAdd: (files: EditableFileEntity[]) => void;
      onDelete: (index: number) => void;
    }
  | { view: true; value: (FileInterface | FileEntity)[] }
);

function FormFieldAttachments({ required, direction, title, ...props }: FormFieldAttachmentsInterface) {
  return (
    <FormFieldWrapper required={required} title={title} direction={direction} mode={"edit" in props ? "edit" : "view"}>
      <div className={wrapperStyles}>
        {"edit" in props ? (
          <AttachmentsEditModeMultiply {...props} />
        ) : props.value.length !== 0 ? (
          <AttachmentsViewModeMultiply value={props.value} />
        ) : (
          <FormFieldTextEmptyView />
        )}
      </div>
    </FormFieldWrapper>
  );
}

export default observer(FormFieldAttachments);

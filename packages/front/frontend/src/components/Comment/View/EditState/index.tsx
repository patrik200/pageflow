import React from "react";
import { observer } from "mobx-react-lite";
import { DateTime } from "luxon";
import {
  getErrorMessageWithCommonIntl,
  isParseServerErrorResult,
  ParseServerErrorResult,
  useTranslation,
} from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import AttachmentsEditModeMultiply from "components/FormField/Attachments/Modes/EditMode";
import TextEditor from "components/TextEditor";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { UserEntity } from "core/entities/user";
import { FileEntity } from "core/entities/file";

import { UpdateFileRequestResult } from "core/storages/_common/updateFile";

import CommentTemplate from "../Template";
import { EditCommentEntity } from "../entity";

import { actionsWrapperStyles, attachmentsWrapperStyles } from "./style.css";

interface CommentEditStateInterface {
  className?: string;
  id: string;
  author: UserEntity;
  createdAt: DateTime;
  text: string;
  attachments: FileEntity[];
  onCancel: () => void;
  onSave: (
    entity: EditCommentEntity,
  ) => Promise<{ success: true; uploadResults: UpdateFileRequestResult[] } | ParseServerErrorResult>;
}

function CommentEditState({ id, text, attachments, onCancel, onSave, ...props }: CommentEditStateInterface) {
  const { t } = useTranslation("comments-common");
  const entity = React.useMemo(() => EditCommentEntity.buildEntity(id, { text, attachments }), [attachments, id, text]);

  const handleSave = React.useCallback(async () => {
    const result = await onSave(entity);
    if (isParseServerErrorResult(result)) {
      emitRequestError(undefined, result, t({ scope: "view", name: "error_messages", parameter: "edit_unexpected" }));
      return;
    }

    emitRequestErrorFiles(result, t);

    onCancel();
  }, [entity, onCancel, onSave, t]);

  const [{ loading: updating }, asyncHandleSave] = useAsyncFn(handleSave, [handleSave]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleSave }),
    [asyncHandleSave, entity],
  );

  return (
    <CommentTemplate
      {...props}
      bottomContent={
        <div className={actionsWrapperStyles}>
          <Button disabled={updating} size="SMALL" type="WITHOUT_BORDER" onClick={onCancel}>
            {t({ scope: "view", place: "edit_actions", name: "cancel" })}
          </Button>
          <Button loading={updating} size="SMALL" onClick={handleSaveClick}>
            {t({ scope: "view", place: "edit_actions", name: "save" })}
          </Button>
        </div>
      }
    >
      <TextEditor
        disabled={updating}
        initialHTML={entity.text}
        placeholder={t({ scope: "view", name: "text_field", parameter: "placeholder" })}
        errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.text, t)}
        onChange={entity.setText}
        onAddImage={entity.addAttachment}
      />
      <div className={attachmentsWrapperStyles}>
        <AttachmentsEditModeMultiply
          disabled={updating}
          value={entity.attachments}
          onAdd={entity.addAttachments}
          onDelete={entity.deleteAttachmentByIndex}
        />
      </div>
    </CommentTemplate>
  );
}

export default observer(CommentEditState);

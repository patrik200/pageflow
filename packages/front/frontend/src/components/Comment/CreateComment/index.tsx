import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import {
  getErrorMessageWithCommonIntl,
  isParseServerErrorResult,
  ParseServerErrorResult,
  useTranslation,
} from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import cn from "classnames";

import AttachmentsEditModeMultiply from "components/FormField/Attachments/Modes/EditMode";
import TextEditor, { TextEditorRef } from "components/TextEditor";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { UpdateFileRequestResult } from "core/storages/_common/updateFile";

import { EditCommentEntity } from "../View/entity";

import { attachmentsWrapperStyles, bottomWrapperStyles, wrapperStyles } from "./style.css";

interface CreateCommentInterface {
  className?: string;
  onSend: (
    entity: EditCommentEntity,
  ) => Promise<{ success: true; uploadResults: UpdateFileRequestResult[] } | ParseServerErrorResult>;
}

function CreateComment({ className, onSend }: CreateCommentInterface) {
  const { t } = useTranslation("comments-common");

  const [{ loading }, asyncSend] = useAsyncFn(onSend, [onSend]);
  const entity = React.useMemo(() => EditCommentEntity.buildEmptyEntity(), []);

  const handleSendComment = React.useCallback(async () => {
    const result = await asyncSend(entity);

    if (isParseServerErrorResult(result)) {
      emitRequestError(undefined, result, t({ scope: "create", place: "error_messages", name: "unexpected" }));
      return;
    }

    emitRequestErrorFiles(result, t);

    editorRef.current?.clear();
    entity.clear();
  }, [asyncSend, entity, t]);

  const handleSendClick = React.useCallback(
    () => entity.submit({ onSuccess: handleSendComment }),
    [entity, handleSendComment],
  );

  const editorRef = React.useRef<TextEditorRef | null>(null);

  return (
    <div className={cn(wrapperStyles, className)}>
      <TextEditor
        ref={editorRef}
        disabled={loading}
        initialHTML={entity.text}
        placeholder={t({ scope: "create", name: "text_field", parameter: "placeholder" })}
        errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.text, t)}
        onChange={entity.setText}
        onAddImage={entity.addAttachment}
      />
      <div className={bottomWrapperStyles}>
        <div className={attachmentsWrapperStyles}>
          <AttachmentsEditModeMultiply
            disabled={loading}
            value={entity.attachments}
            onAdd={entity.addAttachments}
            onDelete={entity.deleteAttachmentByIndex}
          />
        </div>
        <Button loading={loading} disabled={entity.isEmpty} onClick={handleSendClick}>
          {t({ scope: "create", name: "actions", parameter: "send" })}
        </Button>
      </div>
    </div>
  );
}

export default observer(CreateComment);

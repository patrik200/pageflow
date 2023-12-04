import React from "react";
import { observer } from "mobx-react-lite";
import { DateTime } from "luxon";
import { ParseServerErrorResult, useTranslation } from "@app/front-kit";
import { Typography } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import AdditionalActions, { AdditionalActionButton } from "components/AdditionalActions";
import AttachmentsViewModeMultiply from "components/FormField/Attachments/Modes/ViewMode";
import EditorText from "components/TextEditor/EditorText";

import { emitRequestError } from "core/emitRequest";

import { UserEntity } from "core/entities/user";
import { FileEntity } from "core/entities/file";

import CommentTemplate from "../Template";

import { attachmentsWrapperStyles, bottomWrapperStyles, updatedCommentTextStyles } from "./style.css";

interface CommentViewStateInterface {
  className?: string;
  id: string;
  author: UserEntity;
  createdAt: DateTime;
  updated: boolean;
  actions?: React.ReactNode;
  canUpdate?: boolean;
  text: string;
  attachments: FileEntity[];
  onEdit: () => void;
  onDelete: (id: string) => Promise<true | ParseServerErrorResult>;
}

function CommentViewState({
  id,
  actions,
  text,
  attachments,
  canUpdate,
  updated,
  onEdit,
  onDelete,
  ...props
}: CommentViewStateInterface) {
  const { t } = useTranslation("comments-common");

  const handleDelete = React.useCallback(async () => {
    const result = await onDelete(id);
    if (result) return;
    emitRequestError(undefined, result, t({ scope: "view", name: "error_messages", parameter: "delete_unexpected" }));
  }, [id, onDelete, t]);

  const [{ loading: deleting }, asyncDeleteClick] = useAsyncFn(handleDelete, [handleDelete]);

  return (
    <CommentTemplate
      {...props}
      actions={
        <>
          {actions}
          {canUpdate && (
            <AdditionalActions>
              <AdditionalActionButton text={t({ scope: "view", place: "actions", name: "edit" })} onClick={onEdit} />
              <AdditionalActionButton
                loading={deleting}
                text={t({ scope: "view", place: "actions", name: "delete" })}
                onClick={asyncDeleteClick}
              />
            </AdditionalActions>
          )}
        </>
      }
      bottomContent={
        <>
          {updated && (
            <div className={bottomWrapperStyles}>
              <Typography className={updatedCommentTextStyles}>{t({ scope: "view", name: "modified_tag" })}</Typography>
            </div>
          )}
        </>
      }
    >
      <EditorText text={text} />
      {attachments.length !== 0 && (
        <div className={attachmentsWrapperStyles}>
          <AttachmentsViewModeMultiply value={attachments} />
        </div>
      )}
    </CommentTemplate>
  );
}

export default observer(CommentViewState);

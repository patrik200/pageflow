import React from "react";
import { observer } from "mobx-react-lite";
import { DateTime } from "luxon";
import { ParseServerErrorResult } from "@app/front-kit";

import { UserEntity } from "core/entities/user";
import { FileEntity } from "core/entities/file";

import { UpdateFileRequestResult } from "core/storages/_common/updateFile";

import CommentViewState from "./ViewState";
import CommentEditState from "./EditState";
import { EditCommentEntity } from "./entity";

interface CommentInterface {
  className?: string;
  editState: boolean;
  id: string;
  author: UserEntity;
  createdAt: DateTime;
  updated: boolean;
  actions?: React.ReactNode;
  canUpdate: boolean;
  text: string;
  attachments: FileEntity[];
  onDelete: (id: string) => Promise<true | ParseServerErrorResult>;
  onEdit: (
    entity: EditCommentEntity,
  ) => Promise<{ success: true; uploadResults: UpdateFileRequestResult[] } | ParseServerErrorResult>;
  enableEdit: () => void;
  disableEdit: () => void;
}

function Comment({
  className,
  editState,
  id,
  actions,
  text,
  attachments,
  canUpdate,
  updated,
  author,
  createdAt,
  onDelete,
  onEdit,
  enableEdit,
  disableEdit,
}: CommentInterface) {
  if (editState)
    return (
      <CommentEditState
        className={className}
        id={id}
        text={text}
        attachments={attachments}
        createdAt={createdAt}
        author={author}
        onCancel={disableEdit}
        onSave={onEdit}
      />
    );

  return (
    <CommentViewState
      className={className}
      id={id}
      text={text}
      attachments={attachments}
      canUpdate={canUpdate}
      createdAt={createdAt}
      author={author}
      updated={updated}
      actions={actions}
      onEdit={enableEdit}
      onDelete={onDelete}
    />
  );
}

export default observer(Comment);

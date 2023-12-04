import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import Comment from "components/Comment/View";
import Divider from "components/Divider";
import { EditCommentEntity } from "components/Comment/View/entity";

import { EditTicketCommentEntity } from "core/storages/ticket/entities/EditTicketComment";
import { TicketCommentEntity } from "core/entities/ticket/ticketComment";

import { TicketCommentsStorage } from "core/storages/ticket/comments";

import { wrapperStyles } from "./style.css";

interface TicketCommentInterface {
  comment: TicketCommentEntity;
}

function TicketComment({ comment }: TicketCommentInterface) {
  const { loadComments, updateComment, deleteComment } = useViewContext().containerInstance.get(TicketCommentsStorage);

  const handleDelete = React.useCallback(
    async (id: string) => {
      const result = await deleteComment(id);
      if (result.success) {
        await loadComments();
        return true;
      }
      return result.error;
    },
    [deleteComment, loadComments],
  );

  const handleEdit = React.useCallback(
    async (entity: EditCommentEntity) => {
      const result = await updateComment(EditTicketCommentEntity.buildFromEditCommentEntity(entity));
      if (result.success) {
        await loadComments();
        return result;
      }
      return result.error;
    },
    [loadComments, updateComment],
  );

  const [edit, enableEdit, disableEdit] = useBoolean(false);

  return (
    <div className={wrapperStyles}>
      <Comment
        editState={edit}
        text={comment.text}
        id={comment.id}
        attachments={comment.files}
        author={comment.author}
        createdAt={comment.viewCreatedAtDateTime}
        canUpdate={comment.canUpdate}
        updated={comment.updated}
        onDelete={handleDelete}
        onEdit={handleEdit}
        enableEdit={enableEdit}
        disableEdit={disableEdit}
      />
      <Divider />
    </div>
  );
}

export default observer(TicketComment);

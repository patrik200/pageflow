import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import Comment from "components/Comment/View";
import Divider from "components/Divider";
import { EditCommentEntity } from "components/Comment/View/entity";

import { CorrespondenceRevisionCommentEntity } from "core/entities/correspondenceRevision/revisionComment";
import { EditCorrespondenceRevisionCommentEntity } from "core/storages/correspondence/entities/comment/EditCorrespondenceRevisionComment";

import { CorrespondenceRevisionCommentsStorage } from "core/storages/correspondence/revisionComments";

import { wrapperStyles } from "./style.css";

interface CorrespondenceRevisionCommentInterface {
  comment: CorrespondenceRevisionCommentEntity;
}

function CorrespondenceRevisionComment({ comment }: CorrespondenceRevisionCommentInterface) {
  const { loadComments, deleteComment, updateComment } = useViewContext().containerInstance.get(
    CorrespondenceRevisionCommentsStorage,
  );

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
      const result = await updateComment(EditCorrespondenceRevisionCommentEntity.buildFromEditCommentEntity(entity));
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

export default observer(CorrespondenceRevisionComment);

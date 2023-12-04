import React from "react";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import Comment from "components/Comment/View";
import { EditCommentEntity } from "components/Comment/View/entity";

import { DocumentRevisionCommentDiscussionEntity } from "core/entities/documentRevision/revisionCommentDiscussion";
import { EditDocumentRevisionCommentDiscussionEntity } from "core/storages/document/entities/comment/EditDocumentRevisionCommentDiscussion";

import { DocumentRevisionCommentsStorage } from "core/storages/document/revisionComments";

import { DocumentRevisionsStorage } from "../../../../../../../../../../../core/storages/document/revisions";

interface CommentDiscussionInterface {
  className?: string;
  commentId: string;
  discussion: DocumentRevisionCommentDiscussionEntity;
}

function CommentDiscussion({ className, commentId, discussion }: CommentDiscussionInterface) {
  const [edit, enableEdit, disableEdit] = useBoolean(false);

  const { containerInstance } = useViewContext();
  const { updateDiscussion, deleteDiscussion } = containerInstance.get(DocumentRevisionCommentsStorage);
  const revision = containerInstance.get(DocumentRevisionsStorage).revisionDetail!;

  const handleDelete = React.useCallback(
    async (id: string) => {
      const result = await deleteDiscussion(commentId, id);
      if (result.success) return true;
      return result.error;
    },
    [commentId, deleteDiscussion],
  );

  const handleEdit = React.useCallback(
    async (entity: EditCommentEntity) => {
      const discussion = EditDocumentRevisionCommentDiscussionEntity.buildFromEditCommentEntity(commentId, entity);
      const result = await updateDiscussion(discussion);
      if (result.success) return result;
      return result.error;
    },
    [commentId, updateDiscussion],
  );

  return (
    <Comment
      className={className}
      editState={edit}
      text={discussion.text}
      id={discussion.id}
      attachments={discussion.files}
      author={discussion.author}
      createdAt={discussion.viewCreatedAtDateTime}
      canUpdate={discussion.canUpdate && revision.canEditComments}
      updated={discussion.updated}
      onDelete={handleDelete}
      onEdit={handleEdit}
      enableEdit={enableEdit}
      disableEdit={disableEdit}
    />
  );
}

export default observer(CommentDiscussion);

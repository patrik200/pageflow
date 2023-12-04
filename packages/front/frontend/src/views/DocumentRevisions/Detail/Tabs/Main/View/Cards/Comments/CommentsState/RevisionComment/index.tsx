import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import Comment from "components/Comment/View";
import { EditCommentEntity } from "components/Comment/View/entity";
import CreateComment from "components/Comment/CreateComment";
import Card from "components/Card";

import { DocumentRevisionCommentEntity } from "core/entities/documentRevision/revisionComment";
import { EditDocumentRevisionCommentEntity } from "core/storages/document/entities/comment/EditDocumentRevisionComment";
import { EditDocumentRevisionCommentDiscussionEntity } from "core/storages/document/entities/comment/EditDocumentRevisionCommentDiscussion";
import { CommentsFilterEntity } from "core/storages/document/entities/comment/CommentsFilter";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentRevisionCommentsStorage } from "core/storages/document/revisionComments";

import CommentDiscussion from "./Discussion";
import DocumentRevisionCommentActions from "./Actions";

import { discussionStyles, wrapperStyles } from "./style.css";

interface DocumentRevisionCommentInterface {
  comment: DocumentRevisionCommentEntity;
  filter: CommentsFilterEntity;
}

function DocumentRevisionComment({ comment, filter }: DocumentRevisionCommentInterface) {
  const { containerInstance } = useViewContext();
  const { loadComments, deleteComment, updateComment, createDiscussion } = containerInstance.get(
    DocumentRevisionCommentsStorage,
  );
  const revision = containerInstance.get(DocumentRevisionsStorage).revisionDetail!;

  const handleDelete = React.useCallback(
    async (id: string) => {
      const result = await deleteComment(id);
      if (result.success) {
        await loadComments(filter);
        return true;
      }
      return result.error;
    },
    [deleteComment, filter, loadComments],
  );

  const handleEdit = React.useCallback(
    async (entity: EditCommentEntity) => {
      const result = await updateComment(EditDocumentRevisionCommentEntity.buildFromEditCommentEntity(entity));
      if (result.success) {
        await loadComments(filter);
        return result;
      }
      return result.error;
    },
    [filter, loadComments, updateComment],
  );

  const handleCreateDiscussion = React.useCallback(
    async (entity: EditCommentEntity) => {
      const discussion = EditDocumentRevisionCommentDiscussionEntity.buildFromEditCommentEntity(comment.id, entity);
      const result = await createDiscussion(discussion);
      if (result.success) return result;
      return result.error;
    },
    [comment.id, createDiscussion],
  );

  const [edit, enableEdit, disableEdit] = useBoolean(false);

  return (
    <Card key={comment.id} className={wrapperStyles}>
      <Comment
        editState={edit}
        text={comment.text}
        id={comment.id}
        actions={<DocumentRevisionCommentActions comment={comment} />}
        attachments={comment.files}
        author={comment.author}
        createdAt={comment.viewCreatedAtDateTime}
        canUpdate={comment.canUpdate && revision.canEditComments}
        updated={comment.updated}
        onDelete={handleDelete}
        onEdit={handleEdit}
        enableEdit={enableEdit}
        disableEdit={disableEdit}
      />
      {comment.discussions.map((discussion) => (
        <CommentDiscussion
          key={discussion.id}
          className={discussionStyles}
          commentId={comment.id}
          discussion={discussion}
        />
      ))}
      {revision.canEditComments && <CreateComment className={discussionStyles} onSend={handleCreateDiscussion} />}
    </Card>
  );
}

export default observer(DocumentRevisionComment);

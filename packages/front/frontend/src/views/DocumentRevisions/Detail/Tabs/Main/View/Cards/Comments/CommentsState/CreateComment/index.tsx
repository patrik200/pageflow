import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import CreateComment from "components/Comment/CreateComment";
import { EditCommentEntity } from "components/Comment/View/entity";

import { EditDocumentRevisionCommentEntity } from "core/storages/document/entities/comment/EditDocumentRevisionComment";

import { DocumentRevisionCommentsStorage } from "core/storages/document/revisionComments";
import { DocumentRevisionsStorage } from "core/storages/document/revisions";

function CreateRevisionComment() {
  const { containerInstance } = useViewContext();
  const { createComment } = containerInstance.get(DocumentRevisionCommentsStorage);
  const revision = containerInstance.get(DocumentRevisionsStorage).revisionDetail!;

  const handleCreateComment = React.useCallback(
    async (entity: EditCommentEntity) => {
      const result = await createComment(
        EditDocumentRevisionCommentEntity.buildFromEditCommentEntity(entity, { revisionId: revision.id }),
      );
      if (result.success) return result;
      return result.error;
    },
    [createComment, revision],
  );

  if (!revision.canEditComments) return null;

  return <CreateComment onSend={handleCreateComment} />;
}

export default observer(CreateRevisionComment);

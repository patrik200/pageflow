import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import CreateComment from "components/Comment/CreateComment";
import { EditCommentEntity } from "components/Comment/View/entity";

import { EditCorrespondenceRevisionCommentEntity } from "core/storages/correspondence/entities/comment/EditCorrespondenceRevisionComment";

import { CorrespondenceRevisionCommentsStorage } from "core/storages/correspondence/revisionComments";
import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

function CreateRevisionComment() {
  const { containerInstance } = useViewContext();
  const { createComment } = containerInstance.get(CorrespondenceRevisionCommentsStorage);
  const { revisionDetail } = containerInstance.get(CorrespondenceRevisionsStorage);

  const handleCreateComment = React.useCallback(
    async (entity: EditCommentEntity) => {
      const result = await createComment(
        EditCorrespondenceRevisionCommentEntity.buildFromEditCommentEntity(entity, { revisionId: revisionDetail!.id }),
      );
      if (result.success) return result;
      return result.error;
    },
    [createComment, revisionDetail],
  );

  return <CreateComment onSend={handleCreateComment} />;
}

export default observer(CreateRevisionComment);

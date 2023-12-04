import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import CreateComment from "components/Comment/CreateComment";
import { EditCommentEntity } from "components/Comment/View/entity";

import { EditTicketCommentEntity } from "core/storages/ticket/entities/EditTicketComment";

import { TicketsStorage } from "core/storages/ticket";
import { TicketCommentsStorage } from "core/storages/ticket/comments";

function CreateTicketComment() {
  const { containerInstance } = useViewContext();
  const { createComment, loadComments } = containerInstance.get(TicketCommentsStorage);
  const { ticketDetail } = containerInstance.get(TicketsStorage);

  const handleCreateComment = React.useCallback(
    async (entity: EditCommentEntity) => {
      const result = await createComment(
        EditTicketCommentEntity.buildFromEditCommentEntity(entity, { ticketId: ticketDetail!.id }),
      );

      if (result.success) {
        await loadComments();
        return result;
      }

      return result.error;
    },
    [createComment, ticketDetail, loadComments],
  );

  return <CreateComment onSend={handleCreateComment} />;
}

export default observer(CreateTicketComment);

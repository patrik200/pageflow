import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import { TicketCommentsStorage } from "core/storages/ticket/comments";

import CreateTicketComment from "./CreateComment";
import TicketComment from "./TicketComment";

import { discussionsWrapperStyles, contentWrapperStyles } from "./style.css";

function DiscussionsState() {
  const { comments } = useViewContext().containerInstance.get(TicketCommentsStorage);

  return (
    <div className={contentWrapperStyles}>
      {comments.length !== 0 && (
        <div className={discussionsWrapperStyles}>
          {comments.map((comment) => (
            <TicketComment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      <CreateTicketComment />
    </div>
  );
}

export default observer(DiscussionsState);

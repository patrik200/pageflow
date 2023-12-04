import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import { CorrespondenceRevisionCommentsStorage } from "core/storages/correspondence/revisionComments";

import CreateRevisionComment from "./CreateComment";
import CorrespondenceRevisionComment from "./RevisionComment";

import { commentsWrapperStyles, contentWrapperStyles } from "./style.css";

function CommentsState() {
  const { comments } = useViewContext().containerInstance.get(CorrespondenceRevisionCommentsStorage);

  return (
    <div className={contentWrapperStyles}>
      {comments.length !== 0 && (
        <div className={commentsWrapperStyles}>
          {comments.map((comment) => (
            <CorrespondenceRevisionComment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      <CreateRevisionComment />
    </div>
  );
}

export default observer(CommentsState);

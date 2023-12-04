import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import { CommentsFilterEntity } from "core/storages/document/entities/comment/CommentsFilter";

import { DocumentRevisionCommentsStorage } from "core/storages/document/revisionComments";

import CreateRevisionComment from "./CreateComment";
import DocumentRevisionComment from "./RevisionComment";

import { commentsWrapperStyles, wrapperStyles } from "./style.css";

interface CommentsStateInterface {
  filter: CommentsFilterEntity;
}

function CommentsState({ filter }: CommentsStateInterface) {
  const { comments } = useViewContext().containerInstance.get(DocumentRevisionCommentsStorage);

  return (
    <div className={wrapperStyles}>
      {comments.length !== 0 && (
        <div className={commentsWrapperStyles}>
          {comments.map((comment) => (
            <DocumentRevisionComment key={comment.id} comment={comment} filter={filter} />
          ))}
        </div>
      )}
      <CreateRevisionComment />
    </div>
  );
}

export default observer(CommentsState);

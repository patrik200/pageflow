import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Typography } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import Tag from "components/Tag";

import { emitRequestError } from "core/emitRequest";

import { DocumentRevisionCommentEntity } from "core/entities/documentRevision/revisionComment";

import { DocumentRevisionCommentsStorage } from "core/storages/document/revisionComments";

import { statusTitleStyles, statusWrapperStyles, wrapperStyles } from "./style.css";

interface DocumentRevisionCommentActionsInterface {
  comment: DocumentRevisionCommentEntity;
}

function DocumentRevisionCommentActions({ comment }: DocumentRevisionCommentActionsInterface) {
  const { t } = useTranslation("document-revision-detail");
  const { resolveComment } = useViewContext().containerInstance.get(DocumentRevisionCommentsStorage);
  const [{ loading }, asyncResolveComment] = useAsyncFn(resolveComment, [resolveComment]);

  const handleResolveComment = React.useCallback(async () => {
    const result = await asyncResolveComment(comment.id);
    if (result.success) return;
    emitRequestError(
      undefined,
      result.error,
      t({
        scope: "main_tab",
        place: "comments",
        name: "comment_actions",
        parameter: "resolve_action.error_messages.unexpected",
      }),
    );
  }, [asyncResolveComment, comment.id, t]);

  return (
    <div className={wrapperStyles}>
      <div className={statusWrapperStyles}>
        <Typography className={statusTitleStyles}>
          {t({ scope: "main_tab", place: "comments", name: "comment_actions", parameter: "status_title" })}
        </Typography>
        <Tag
          text={t({
            scope: "main_tab",
            place: "comments",
            name: "comment_actions.statuses",
            parameter: comment.resolved ? "resolved" : "not_resolved",
          })}
          variant="light"
          mode={comment.resolved ? "success" : "error"}
        />
      </div>
      {comment.canResolve && (
        <Button loading={loading} size="SMALL" onClick={handleResolveComment}>
          {t({ scope: "main_tab", place: "comments", name: "comment_actions", parameter: "resolve_action.button" })}
        </Button>
      )}
    </div>
  );
}

export default observer(DocumentRevisionCommentActions);

import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentStorage } from "core/storages/document";

import { buttonStyles } from "./style.css";

function DocumentRevisionMoveToInitialForCancelReviewAction() {
  const { t } = useTranslation("document-revision-detail");

  const { containerInstance } = useViewContext();

  const { revisionDetail, moveToInitialStatusForCancelReview } = containerInstance.get(DocumentRevisionsStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);

  const [{ loading }, asyncMoveToInitialStatusForCancelReview] = useAsyncFn(moveToInitialStatusForCancelReview, [
    moveToInitialStatusForCancelReview,
  ]);

  const handleMoveToInitialStatusForCancelReview = React.useCallback(async () => {
    const result = await asyncMoveToInitialStatusForCancelReview();
    if (result.success) return;
    emitRequestError(
      undefined,
      result.error,
      t({ scope: "view_revision", name: "change_status_errors", parameter: "unexpected" }),
    );
  }, [asyncMoveToInitialStatusForCancelReview, t]);

  if (!documentDetail?.resultCanEdit) return null;
  if (!revisionDetail!.canMoveToInitialStatusForCancelReview) return null;

  return (
    <Button className={buttonStyles} loading={loading} size="SMALL" onClick={handleMoveToInitialStatusForCancelReview}>
      {t({
        scope: "view_revision",
        place: "action_statuses",
        name: "move_to_initial_for_cancel_review",
        parameter: "button",
      })}
    </Button>
  );
}

export default observer(DocumentRevisionMoveToInitialForCancelReviewAction);

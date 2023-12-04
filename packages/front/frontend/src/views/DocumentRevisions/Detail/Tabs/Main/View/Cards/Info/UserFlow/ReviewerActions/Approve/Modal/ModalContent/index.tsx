import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { Checkbox, ModalActions, ModalTitle, TextField } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { MoveToReviewerApprovedStatusEntity } from "core/storages/document/entities/revision/MoveToReviewerApprovedStatusEntity";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

import { contentWrapperStyles, wrapperStyles } from "./style.css";

interface MoveToReviewerApprovedStatusModalContentInterface {
  onClose: () => void;
}

function MoveToReviewerApprovedStatusModalContent({ onClose }: MoveToReviewerApprovedStatusModalContentInterface) {
  const { t } = useTranslation("document-revision-detail");
  const { containerInstance } = useViewContext();

  const entity = React.useMemo(() => MoveToReviewerApprovedStatusEntity.buildEmpty(), []);
  const { moveToApprovedStatus } = containerInstance.get(DocumentRevisionsStorage);

  const handleApprove = React.useCallback(async () => {
    const result = await moveToApprovedStatus({
      responsibleUserFlowReviewer: true,
      moveToReviewerApprovedStatusEntity: entity,
    });
    if (result.success) {
      onClose();
      return;
    }
    emitRequestError(undefined, result.error, t({ scope: "user_flow", place: "reviewer", name: "unexpected_error" }));
  }, [entity, moveToApprovedStatus, onClose, t]);

  const [{ loading }, asyncHandleApprove] = useAsyncFn(handleApprove, [handleApprove]);

  const handleApproveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleApprove }),
    [asyncHandleApprove, entity],
  );

  return (
    <div className={wrapperStyles}>
      <ModalTitle>{t({ scope: "view_revision", place: "move_to_reviewer_approved_modal", name: "title" })}</ModalTitle>
      <div className={contentWrapperStyles}>
        <Checkbox value={entity.hasComment} onChange={entity.setHasComment}>
          {t({
            scope: "view_revision",
            place: "move_to_reviewer_approved_modal",
            name: "remark_checkbox",
            parameter: "placeholder",
          })}
        </Checkbox>
        {entity.hasComment && (
          <TextField
            textArea
            required
            rows={5}
            value={entity.comment}
            placeholder={t({
              scope: "view_revision",
              place: "move_to_reviewer_approved_modal",
              name: "remark_field",
              parameter: "placeholder",
            })}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.comment, t)}
            onChangeInput={entity.setComment}
          />
        )}
      </div>
      <ModalActions
        primaryActionText={t({ scope: "view_revision", place: "move_to_reviewer_approved_modal", name: "action" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleApproveClick}
      />
    </div>
  );
}

export default observer(MoveToReviewerApprovedStatusModalContent);

import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { Checkbox, ModalActions, ModalTitle, TextField } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { MoveToApprovedStatusEntity } from "core/storages/document/entities/revision/MoveToApprovedStatusEntity";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

import { contentWrapperStyles, wrapperStyles } from "./style.css";

interface MoveToApprovedStatusModalContentInterface {
  onClose: () => void;
}

function MoveToApprovedStatusModalContent({ onClose }: MoveToApprovedStatusModalContentInterface) {
  const { t } = useTranslation("document-revision-detail");
  const { containerInstance } = useViewContext();

  const entity = React.useMemo(() => MoveToApprovedStatusEntity.buildEmpty(), []);
  const { moveToApprovedStatus } = containerInstance.get(DocumentRevisionsStorage);

  const handleApproveRevision = React.useCallback(async () => {
    const result = await moveToApprovedStatus({ moveToApprovedStatusEntity: entity });
    if (result.success) {
      onClose();
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "view_revision", name: "change_status_errors", parameter: "unexpected" }),
    );
  }, [entity, moveToApprovedStatus, onClose, t]);

  const [{ loading }, asyncHandleApproveRevision] = useAsyncFn(handleApproveRevision, [handleApproveRevision]);

  const handleApproveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleApproveRevision }),
    [asyncHandleApproveRevision, entity],
  );

  return (
    <div className={wrapperStyles}>
      <ModalTitle>{t({ scope: "view_revision", place: "move_to_approved_modal", name: "title" })}</ModalTitle>
      <div className={contentWrapperStyles}>
        <Checkbox value={entity.hasComment} onChange={entity.setHasComment}>
          {t({
            scope: "view_revision",
            place: "move_to_approved_modal",
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
              place: "move_to_approved_modal",
              name: "remark_field",
              parameter: "placeholder",
            })}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.comment, t)}
            onChangeInput={entity.setComment}
          />
        )}
      </div>
      <ModalActions
        primaryActionText={t({ scope: "view_revision", place: "move_to_approved_modal", name: "action" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleApproveClick}
      />
    </div>
  );
}

export default observer(MoveToApprovedStatusModalContent);

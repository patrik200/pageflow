import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import GroupedContent from "components/FormField/GroupedContent";
import FormFieldText from "components/FormField/Text";
import FormFieldAttachments from "components/FormField/Attachments";

import { emitRequestError } from "core/emitRequest";

import { ApproveUserFlowRowUserEntity } from "core/storages/document/entities/revision/ApproveUserFlowRowUser";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

import { wrapperStyles } from "./style.css";

interface ApproveUserFlowRowUserModalContentInterface {
  entity: ApproveUserFlowRowUserEntity;
  rowIndex: number;
  userIndex: number;
  onClose: () => void;
}

function ApproveUserFlowRowUserModalContent({
  entity,
  rowIndex,
  userIndex,
  onClose,
}: ApproveUserFlowRowUserModalContentInterface) {
  const { t } = useTranslation("document-revision-detail");
  const { moveToApprovedStatus } = useViewContext().containerInstance.get(DocumentRevisionsStorage);

  const handleApprove = React.useCallback(async () => {
    const result = await moveToApprovedStatus({
      responsibleUserFlowRowIndex: rowIndex,
      responsibleUserFlowRowUserIndex: userIndex,
      approveUserFlowRowUserEntity: entity,
    });

    if (result.success) {
      onClose();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "user_flow", place: "row_user_approve_modal", name: "unexpected_error" }),
    );
  }, [moveToApprovedStatus, rowIndex, userIndex, entity, t, onClose]);

  const [{ loading }, asyncHandleApprove] = useAsyncFn(handleApprove, [handleApprove]);

  return (
    <>
      <ModalTitle>{t({ scope: "user_flow", place: "row_user_approve_modal", name: "title" })}</ModalTitle>
      <div className={wrapperStyles}>
        <GroupedContent>
          <FormFieldText
            edit
            disabled={loading}
            rows={4}
            title={t({ scope: "user_flow", place: "row_user_approve_modal", name: "result_field" })}
            value={entity.result}
            onChange={entity.setResult}
          />
          <FormFieldAttachments
            edit
            disabled={loading}
            title={t({ scope: "user_flow", place: "row_user_approve_modal", name: "attachments_field" })}
            value={entity.attachments}
            onAdd={entity.addAttachments}
            onDelete={entity.deleteAttachmentByIndex}
          />
        </GroupedContent>
      </div>
      <ModalActions
        primaryActionText={t({ scope: "user_flow", place: "row_user_approve_modal", name: "action" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={asyncHandleApprove}
      />
    </>
  );
}

export default observer(ApproveUserFlowRowUserModalContent);

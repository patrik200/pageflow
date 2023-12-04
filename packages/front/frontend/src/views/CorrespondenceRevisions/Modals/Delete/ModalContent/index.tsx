import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { CorrespondenceRevisionEntity } from "core/entities/correspondenceRevision/revision";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

import { actionsStyles, wrapperStyles } from "./style.css";

interface DeleteCorrespondenceRevisionModalContentInterface {
  revision: CorrespondenceRevisionEntity;
  close: () => void;
  onSuccess?: () => void | Promise<void>;
}

function DeleteCorrespondenceRevisionModalContent({
  revision,
  close,
  onSuccess,
}: DeleteCorrespondenceRevisionModalContentInterface) {
  const { t } = useTranslation("correspondence-revision-detail");
  const { delete: deleteRevision } = useViewContext().containerInstance.get(CorrespondenceRevisionsStorage);

  const handleDeleteRevision = React.useCallback(async () => {
    const result = await deleteRevision(revision.id);
    if (result.success) {
      close();
      emitRequestSuccess(t({ scope: "delete_revision_modal", name: "success_message" }));
      await onSuccess?.();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "delete_revision_modal", name: "error_messages", parameter: "unexpected" }),
    );
  }, [close, deleteRevision, onSuccess, revision.id, t]);

  const [{ loading }, asyncHandleDeleteRevision] = useAsyncFn(handleDeleteRevision, [handleDeleteRevision]);

  return (
    <div className={wrapperStyles}>
      <ModalTitle>{t({ scope: "delete_revision_modal", name: "title" }, { number: revision.number })}</ModalTitle>
      <ModalActions
        className={actionsStyles}
        primaryActionText={t({ scope: "delete_revision_modal", place: "actions", name: "delete" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={asyncHandleDeleteRevision}
      />
    </div>
  );
}

export default observer(DeleteCorrespondenceRevisionModalContent);

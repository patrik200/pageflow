import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import { CorrespondenceStorage } from "core/storages/correspondence";

import { actionsStyles, wrapperStyles } from "./style.css";

interface DeleteCorrespondenceModalContentInterface {
  correspondence: CorrespondenceEntity;
  close: () => void;
  onSuccess?: () => void | Promise<void>;
}

function DeleteCorrespondenceModalContent({
  correspondence,
  close,
  onSuccess,
}: DeleteCorrespondenceModalContentInterface) {
  const { t } = useTranslation("correspondence");
  const { deleteCorrespondence } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const handleDeleteCorrespondence = React.useCallback(async () => {
    const result = await deleteCorrespondence(correspondence.id);
    if (result.success) {
      await onSuccess?.();
      close();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "delete_correspondence_modal", place: "error_messages", name: "unexpected" }),
    );
  }, [close, correspondence.id, deleteCorrespondence, onSuccess, t]);

  const [{ loading }, asyncHandleDeleteCorrespondence] = useAsyncFn(handleDeleteCorrespondence, [
    handleDeleteCorrespondence,
  ]);

  return (
    <div className={wrapperStyles}>
      <ModalTitle>
        {t({ scope: "delete_correspondence_modal", name: "title" }, { name: correspondence.name })}
      </ModalTitle>
      <ModalActions
        className={actionsStyles}
        primaryActionText={t({ scope: "delete_correspondence_modal", place: "actions", name: "delete" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={asyncHandleDeleteCorrespondence}
      />
    </div>
  );
}

export default observer(DeleteCorrespondenceModalContent);

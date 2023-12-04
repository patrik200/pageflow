import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { DocumentEntity } from "core/entities/document/document";

import { DocumentStorage } from "core/storages/document";

import { actionsStyles, wrapperStyles } from "./style.css";

interface DeleteDocumentModalContentInterface {
  document: DocumentEntity;
  close: () => void;
  onSuccess?: () => void | Promise<void>;
}

function DeleteDocumentModalContent({ document, close, onSuccess }: DeleteDocumentModalContentInterface) {
  const { t } = useTranslation("document");
  const { deleteDocument } = useViewContext().containerInstance.get(DocumentStorage);

  const handleDeleteDocument = React.useCallback(async () => {
    const result = await deleteDocument(document.id);
    if (result.success) {
      await onSuccess?.();
      close();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "delete_document_modal", place: "error_messages", name: "unexpected" }),
    );
  }, [deleteDocument, document.id, t, onSuccess, close]);

  const [{ loading }, asyncHandleDeleteDocument] = useAsyncFn(handleDeleteDocument, [handleDeleteDocument]);

  return (
    <div className={wrapperStyles}>
      <ModalTitle>{t({ scope: "delete_document_modal", name: "title" }, { name: document.name })}</ModalTitle>
      <ModalActions
        className={actionsStyles}
        primaryActionText={t({ scope: "delete_document_modal", place: "actions", name: "delete" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={asyncHandleDeleteDocument}
      />
    </div>
  );
}

export default observer(DeleteDocumentModalContent);

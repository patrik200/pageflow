import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { DocumentEntity } from "core/entities/document/document";

import { DocumentStorage } from "core/storages/document";

interface ArchiveDocumentActionInterface {
  document: DocumentEntity;
}

function ArchiveDocumentAction({ document }: ArchiveDocumentActionInterface) {
  const { t } = useTranslation("document-detail");
  const { archive } = useViewContext().containerInstance.get(DocumentStorage);

  const handleArchive = React.useCallback(async () => {
    const result = await archive();
    if (result.success) {
      emitRequestSuccess(t({ scope: "archive_document", name: "success_message" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "archive_document", name: "error_messages", parameter: "unexpected" }),
    );
  }, [archive, t]);

  const [{ loading }, asyncArchive] = useAsyncFn(handleArchive, [handleArchive]);

  if (!document.resultCanEdit) return null;
  if (!document.canArchive) return null;

  return (
    <AdditionalActionButton
      loading={loading}
      text={t({ scope: "view_document", place: "actions", name: "archive" })}
      onClick={asyncArchive}
    />
  );
}

export default observer(ArchiveDocumentAction);

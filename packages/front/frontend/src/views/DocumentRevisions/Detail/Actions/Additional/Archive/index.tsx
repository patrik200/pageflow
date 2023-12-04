import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentStorage } from "core/storages/document";

function ArchiveDocumentRevisionAction() {
  const { t } = useTranslation("document-revision-detail");
  const { containerInstance } = useViewContext();

  const { revisionDetail, archive } = containerInstance.get(DocumentRevisionsStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);

  const handleArchive = React.useCallback(async () => {
    const result = await archive();
    if (result.success) {
      emitRequestSuccess(t({ scope: "archive_revision", name: "success_message" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "archive_revision", name: "error_messages", parameter: "unexpected" }),
    );
  }, [archive, t]);

  const [{ loading }, asyncArchive] = useAsyncFn(handleArchive, [handleArchive]);

  if (!documentDetail?.resultCanEdit) return null;
  if (!revisionDetail!.canMoveToArchiveStatus) return null;

  return (
    <AdditionalActionButton
      loading={loading}
      text={t({ scope: "view_revision", place: "actions", name: "archive" })}
      onClick={asyncArchive}
    />
  );
}

export default observer(ArchiveDocumentRevisionAction);

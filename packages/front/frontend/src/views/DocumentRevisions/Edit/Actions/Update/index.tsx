import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useAsyncFn, useEffectSkipFirst } from "@worksolutions/react-utils";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { EditDocumentRevisionEntity } from "core/storages/document/entities/revision/EditDocumentRevision";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

interface DocumentRevisionUpdateActionInterface {
  entity: EditDocumentRevisionEntity;
  enableLoading: () => void;
  disableLoading: () => void;
}

function DocumentRevisionUpdateAction({
  entity,
  enableLoading,
  disableLoading,
}: DocumentRevisionUpdateActionInterface) {
  const { t } = useTranslation("document-revision-detail");

  const { updateRevision } = useViewContext().containerInstance.get(DocumentRevisionsStorage);

  const { push } = useRouter();

  const handleUpdateRevision = React.useCallback(async () => {
    const result = await updateRevision(entity!);
    if (result.success) {
      const hasError = emitRequestErrorFiles(result, t);
      if (!hasError) await push.current("/document-revisions/" + entity!.revisionId!);
      return;
    }

    emitRequestError(
      entity!,
      result.error,
      t({ scope: "edit_revision", name: "error_messages", parameter: "unexpected" }),
    );
  }, [entity, push, t, updateRevision]);

  const [{ loading }, asyncHandleUpdateRevision] = useAsyncFn(handleUpdateRevision, [handleUpdateRevision]);

  useEffectSkipFirst(() => {
    if (loading) enableLoading();
    else disableLoading();
  }, [disableLoading, enableLoading, loading]);

  const handleUpdateClick = React.useCallback(
    () => entity!.submit({ onSuccess: asyncHandleUpdateRevision }),
    [asyncHandleUpdateRevision, entity],
  );

  return (
    <Button size="SMALL" loading={loading} onClick={handleUpdateClick}>
      {t({ scope: "edit_revision", place: "actions", name: "save" })}
    </Button>
  );
}

export default observer(DocumentRevisionUpdateAction);

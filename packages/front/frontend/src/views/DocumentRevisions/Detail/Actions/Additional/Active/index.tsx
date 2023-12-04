import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentStorage } from "core/storages/document";

function ActiveDocumentRevisionAction() {
  const { t } = useTranslation("document-revision-detail");
  const { containerInstance } = useViewContext();

  const { revisionDetail, active } = containerInstance.get(DocumentRevisionsStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);

  const handleActive = React.useCallback(async () => {
    const result = await active();
    if (result.success) {
      emitRequestSuccess(t({ scope: "active_revision", name: "success_message" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "active_revision", name: "error_messages", parameter: "unexpected" }),
    );
  }, [active, t]);

  const [{ loading }, asyncActive] = useAsyncFn(handleActive, [handleActive]);

  if (!documentDetail?.resultCanEdit) return null;
  if (!revisionDetail!.canMoveToInitialStatusForRestore) return null;

  return (
    <AdditionalActionButton
      loading={loading}
      text={t({ scope: "view_revision", place: "actions", name: "active" })}
      onClick={asyncActive}
    />
  );
}

export default observer(ActiveDocumentRevisionAction);

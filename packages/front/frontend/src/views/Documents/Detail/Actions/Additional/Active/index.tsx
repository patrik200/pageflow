import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { DocumentEntity } from "core/entities/document/document";

import { DocumentStorage } from "core/storages/document";

interface ActiveDocumentActionInterface {
  document: DocumentEntity;
}

function ActiveDocumentAction({ document }: ActiveDocumentActionInterface) {
  const { t } = useTranslation("document-detail");
  const { active } = useViewContext().containerInstance.get(DocumentStorage);

  const handleActive = React.useCallback(async () => {
    const result = await active();
    if (result.success) {
      emitRequestSuccess(t({ scope: "active_document", name: "success_message" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "active_document", name: "error_messages", parameter: "unexpected" }),
    );
  }, [active, t]);

  const [{ loading }, asyncArchive] = useAsyncFn(handleActive, [handleActive]);

  if (!document.resultCanEdit) return null;
  if (!document.canActive) return null;

  return (
    <AdditionalActionButton
      loading={loading}
      text={t({ scope: "view_document", place: "actions", name: "active" })}
      onClick={asyncArchive}
    />
  );
}

export default observer(ActiveDocumentAction);

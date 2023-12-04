import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";
import { observer } from "mobx-react-lite";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import CardLoadingPreset from "components/Card/pressets/CardLoading";

import { emitRequestError } from "core/emitRequest";

import { EditDocumentEntity } from "core/storages/document/entities/document/EditDocument";

import { DocumentStorage } from "core/storages/document";

import DocumentDetailMainEdit from "../Detail/Tabs/Main/Edit";
import { useLoadDocument } from "../Detail/hooks/useLoad";
import PageWrapper from "../../_PageWrapper";

function EditDocumentView() {
  const { t } = useTranslation("document-detail");

  const documentLoading = useLoadDocument();

  const { updateDocument, documentDetail } = useViewContext().containerInstance.get(DocumentStorage);

  const entity = React.useMemo(
    () => (documentDetail ? EditDocumentEntity.buildFromDocument(documentDetail) : null),
    [documentDetail],
  );

  const { push } = useRouter();

  const handleUpdateDocument = React.useCallback(async () => {
    const result = await updateDocument(entity!);
    if (result.success) {
      await push.current("/documents/" + entity!.options!.id);
      return;
    }

    emitRequestError(
      entity!,
      result.error,
      t({ scope: "edit_document", name: "error_messages", parameter: "unexpected" }),
    );
  }, [entity, push, t, updateDocument]);

  const [{ loading }, asyncHandleUpdateDocument] = useAsyncFn(handleUpdateDocument, [handleUpdateDocument]);

  const handleUpdateClick = React.useCallback(
    () => entity!.submit({ onSuccess: asyncHandleUpdateDocument }),
    [asyncHandleUpdateDocument, entity],
  );

  const handleCancelClick = React.useCallback(() => push.current("/documents/" + entity!.options!.id), [entity, push]);

  if (documentLoading || !entity || !documentDetail)
    return (
      <PageWrapper title={t({ scope: "meta", name: "view" }, { name: "" })}>
        <CardLoadingPreset
          title={t({ scope: "meta", name: "view" }, { name: "" })}
          actions={
            <Button size="SMALL" type="WITHOUT_BORDER" loading={loading} onClick={handleCancelClick}>
              {t({ scope: "edit_document", place: "action", name: "cancel" })}
            </Button>
          }
        />
      </PageWrapper>
    );

  return (
    <PageWrapper title={t({ scope: "meta", name: "view" }, { name: documentDetail.name })}>
      <CardTitlePreset
        title={documentDetail.name}
        actions={
          <>
            <Button size="SMALL" type="WITHOUT_BORDER" disabled={loading} onClick={handleCancelClick}>
              {t({ scope: "edit_document", place: "action", name: "cancel" })}
            </Button>
            <Button size="SMALL" loading={loading} onClick={handleUpdateClick}>
              {t({ scope: "edit_document", place: "action", name: "save" })}
            </Button>
          </>
        }
      />
      <DocumentDetailMainEdit loading={loading} entity={entity} showPermissions />
    </PageWrapper>
  );
}

export default observer(EditDocumentView);

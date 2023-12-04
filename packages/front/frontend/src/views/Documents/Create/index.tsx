import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { observer } from "mobx-react-lite";

import CardTitlePreset from "components/Card/pressets/CardTitle";

import { emitRequestError } from "core/emitRequest";

import { EditDocumentEntity } from "core/storages/document/entities/document/EditDocument";

import { DocumentStorage } from "core/storages/document";
import { UserFlowStorage } from "core/storages/user-flow";

import DocumentDetailMainEdit from "../Detail/Tabs/Main/Edit";
import PageWrapper from "../../_PageWrapper";

function CreateDocumentView() {
  const { t } = useTranslation("document-detail");
  const { push, query } = useRouter();

  const { createDocument } = useViewContext().containerInstance.get(DocumentStorage);
  const { loadUserFlow } = useViewContext().containerInstance.get(UserFlowStorage);

  const [{ loading: userFlowLoading }, asyncLoadUserFlow] = useAsyncFn(loadUserFlow, [loadUserFlow], {
    loading: true,
  });
  React.useEffect(() => void asyncLoadUserFlow(), [asyncLoadUserFlow]);

  const entity = React.useMemo(
    () =>
      EditDocumentEntity.build(query.parentGroup as string | undefined, {
        projectId: query.project as string | undefined,
      }),
    [query.parentGroup, query.project],
  );

  const handleCreateDocument = React.useCallback(async () => {
    const result = await createDocument(entity);
    if (result.success) {
      await push.current("/documents/" + result.id);
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "create_document", name: "error_messages", parameter: "unexpected" }),
    );
  }, [createDocument, entity, push, t]);

  const [{ loading: creating }, asyncHandleCreateDocument] = useAsyncFn(handleCreateDocument, [handleCreateDocument]);

  const handleCreateClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleCreateDocument }),
    [asyncHandleCreateDocument, entity],
  );

  const resultLoading = creating || userFlowLoading;

  return (
    <PageWrapper title={t({ scope: "meta", name: "create" })}>
      <CardTitlePreset
        title={t({ scope: "meta", name: "create" })}
        actions={
          <Button iconLeft="plusLine" size="SMALL" loading={resultLoading} onClick={handleCreateClick}>
            {t({ scope: "create_document", place: "action", name: "create" })}
          </Button>
        }
      />
      <DocumentDetailMainEdit loading={resultLoading} entity={entity} showPermissions={false} />
    </PageWrapper>
  );
}

export default observer(CreateDocumentView);

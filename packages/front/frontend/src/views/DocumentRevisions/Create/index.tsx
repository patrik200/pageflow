import React from "react";
import { observer } from "mobx-react-lite";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";

import CardTitlePreset from "components/Card/pressets/CardTitle";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { EditDocumentRevisionEntity } from "core/storages/document/entities/revision/EditDocumentRevision";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { UserFlowStorage } from "core/storages/user-flow";

import RevisionDetailMainEdit from "../Detail/Tabs/Main/Edit";
import PageWrapper from "../../_PageWrapper";

function CreateDocumentRevisionView() {
  const { t } = useTranslation("document-revision-detail");
  const { push, query } = useRouter();
  const documentId = query.id as string;

  const { createRevision } = useViewContext().containerInstance.get(DocumentRevisionsStorage);
  const { loadUserFlow } = useViewContext().containerInstance.get(UserFlowStorage);

  const [{ loading: userFlowLoading }, asyncLoadUserFlow] = useAsyncFn(loadUserFlow, [loadUserFlow], {
    loading: true,
  });
  React.useEffect(() => void asyncLoadUserFlow(), [asyncLoadUserFlow]);

  const entity = React.useMemo(() => EditDocumentRevisionEntity.buildEmpty(documentId), [documentId]);

  const handleCreateRevision = React.useCallback(async () => {
    const result = await createRevision(entity);
    if (result.success) {
      const hasError = emitRequestErrorFiles(result, t);
      if (!hasError) await push.current("/document-revisions/" + result.revisionId);
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "create_revision", name: "error_messages", parameter: "unexpected" }),
    );
  }, [createRevision, entity, push, t]);

  const [{ loading: creating }, asyncHandleCreateRevision] = useAsyncFn(handleCreateRevision, [handleCreateRevision]);

  const handleCreateClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleCreateRevision }),
    [asyncHandleCreateRevision, entity],
  );

  const handleCancelClick = React.useCallback(() => void push.current("/documents/" + documentId), [documentId, push]);

  const resultLoading = userFlowLoading || creating;

  return (
    <PageWrapper title={t({ scope: "meta", name: "create" })}>
      <CardTitlePreset
        title={t({ scope: "meta", name: "create" })}
        actions={
          <>
            <Button type="WITHOUT_BORDER" size="SMALL" loading={resultLoading} onClick={handleCancelClick}>
              {t({ scope: "create_revision", place: "actions", name: "cancel" })}
            </Button>
            <Button iconLeft="plusLine" size="SMALL" loading={resultLoading} onClick={handleCreateClick}>
              {t({ scope: "create_revision", place: "actions", name: "create" })}
            </Button>
          </>
        }
      />
      <RevisionDetailMainEdit loading={resultLoading} entity={entity} canUpdateAttachments />
    </PageWrapper>
  );
}

export default observer(CreateDocumentRevisionView);

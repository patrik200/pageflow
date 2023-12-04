import React from "react";
import { observer } from "mobx-react-lite";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";

import CardTitlePreset from "components/Card/pressets/CardTitle";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { EditCorrespondenceRevisionEntity } from "core/storages/correspondence/entities/revision/EditCorrespondenceRevision";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

import RevisionDetailMainEdit from "../Detail/Tabs/Main/Edit";
import PageWrapper from "../../_PageWrapper";

function CreateCorrespondenceRevisionView() {
  const { t } = useTranslation("correspondence-revision-detail");
  const { push, query } = useRouter();
  const correspondenceId = query.id as string;

  const { createRevision } = useViewContext().containerInstance.get(CorrespondenceRevisionsStorage);

  const entity = React.useMemo(() => EditCorrespondenceRevisionEntity.buildEmpty(correspondenceId), [correspondenceId]);

  const handleCreateRevision = React.useCallback(async () => {
    const result = await createRevision(entity);
    if (result.success) {
      const hasError = emitRequestErrorFiles(result, t);
      if (!hasError) await push.current("/correspondence-revisions/" + result.revisionId);
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "create_revision", name: "error_messages", parameter: "unexpected" }),
    );
  }, [createRevision, entity, push, t]);

  const [{ loading }, asyncHandleCreateRevision] = useAsyncFn(handleCreateRevision, [handleCreateRevision]);

  const handleCreateClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleCreateRevision }),
    [asyncHandleCreateRevision, entity],
  );

  const handleCancelClick = React.useCallback(
    () => void push.current("/correspondences/" + correspondenceId),
    [correspondenceId, push],
  );

  return (
    <PageWrapper title={t({ scope: "meta", name: "create" })}>
      <CardTitlePreset
        title={t({ scope: "meta", name: "create" })}
        actions={
          <>
            <Button type="WITHOUT_BORDER" size="SMALL" loading={loading} onClick={handleCancelClick}>
              {t({ scope: "create_revision", place: "actions", name: "cancel" })}
            </Button>
            <Button iconLeft="plusLine" size="SMALL" loading={loading} onClick={handleCreateClick}>
              {t({ scope: "create_revision", place: "actions", name: "create" })}
            </Button>
          </>
        }
      />
      <RevisionDetailMainEdit loading={loading} entity={entity} />
    </PageWrapper>
  );
}

export default observer(CreateCorrespondenceRevisionView);

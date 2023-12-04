import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";
import { observer } from "mobx-react-lite";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import CardLoadingPreset from "components/Card/pressets/CardLoading";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { EditCorrespondenceRevisionEntity } from "core/storages/correspondence/entities/revision/EditCorrespondenceRevision";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

import RevisionDetailMainEdit from "../Detail/Tabs/Main/Edit";
import { useLoadRevision } from "../Detail/hooks/useLoad";
import PageWrapper from "../../_PageWrapper";

function EditCorrespondenceRevisionView() {
  const { t } = useTranslation("correspondence-revision-detail");

  const revisionLoading = useLoadRevision();

  const { updateRevision, revisionDetail } = useViewContext().containerInstance.get(CorrespondenceRevisionsStorage);

  const entity = React.useMemo(
    () => (revisionDetail ? EditCorrespondenceRevisionEntity.buildFromRevisionEntity(revisionDetail) : null),
    [revisionDetail],
  );

  const { push } = useRouter();

  const handleUpdateRevision = React.useCallback(async () => {
    const result = await updateRevision(entity!);
    if (result.success) {
      const hasError = emitRequestErrorFiles(result, t);
      if (!hasError) await push.current("/correspondence-revisions/" + entity!.revisionId!);
      return;
    }

    emitRequestError(
      entity!,
      result.error,
      t({ scope: "edit_revision", name: "error_messages", parameter: "unexpected" }),
    );
  }, [entity, push, t, updateRevision]);

  const [{ loading }, asyncHandleUpdateRevision] = useAsyncFn(handleUpdateRevision, [handleUpdateRevision]);

  const handleUpdateClick = React.useCallback(
    () => entity!.submit({ onSuccess: asyncHandleUpdateRevision }),
    [asyncHandleUpdateRevision, entity],
  );

  const handleCancelClick = React.useCallback(
    () => push.current("/correspondence-revisions/" + entity!.revisionId!),
    [entity, push],
  );

  if (revisionLoading || !entity || !revisionDetail)
    return (
      <PageWrapper title={t({ scope: "meta", name: "edit_not_loaded" })}>
        <CardLoadingPreset
          title={t({ scope: "meta", name: "edit_not_loaded" })}
          actions={
            <Button size="SMALL" type="WITHOUT_BORDER" loading={loading} onClick={handleCancelClick}>
              {t({ scope: "edit_revision", place: "actions", name: "cancel" })}
            </Button>
          }
        />
      </PageWrapper>
    );

  return (
    <PageWrapper title={t({ scope: "meta", name: "edit" }, { number: revisionDetail.number })}>
      <CardTitlePreset
        title={t({ scope: "meta", name: "edit" }, { number: revisionDetail.number })}
        actions={
          <>
            <Button size="SMALL" type="WITHOUT_BORDER" disabled={loading} onClick={handleCancelClick}>
              {t({ scope: "edit_revision", place: "actions", name: "cancel" })}
            </Button>
            <Button size="SMALL" loading={loading} onClick={handleUpdateClick}>
              {t({ scope: "edit_revision", place: "actions", name: "save" })}
            </Button>
          </>
        }
      />
      <RevisionDetailMainEdit loading={loading} entity={entity} />
    </PageWrapper>
  );
}

export default observer(EditCorrespondenceRevisionView);

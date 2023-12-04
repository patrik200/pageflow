import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { observer } from "mobx-react-lite";

import CardTitlePreset from "components/Card/pressets/CardTitle";

import { emitRequestError } from "core/emitRequest";

import { EditCorrespondenceEntity } from "core/storages/correspondence/entities/correspondence/EditCorrespondence";

import { CorrespondenceStorage } from "core/storages/correspondence";

import CorrespondenceDetailMainEdit from "../Detail/Tabs/Main/Edit";
import PageWrapper from "../../_PageWrapper";

function CreateCorrespondenceView() {
  const { t } = useTranslation("correspondence-detail");
  const { push, query } = useRouter();

  const { createCorrespondence } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const entity = React.useMemo(
    () =>
      EditCorrespondenceEntity.build(query.parentGroup as string | undefined, {
        projectId: query.project as string | undefined,
      }),
    [query.parentGroup, query.project],
  );

  const handleCreateCorrespondence = React.useCallback(async () => {
    const result = await createCorrespondence(entity);
    if (result.success) {
      await push.current("/correspondences/" + result.id);
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "create_correspondence", name: "error_messages", parameter: "unexpected" }),
    );
  }, [createCorrespondence, entity, push, t]);

  const [{ loading }, asyncHandleCreateCorrespondence] = useAsyncFn(handleCreateCorrespondence, [
    handleCreateCorrespondence,
  ]);

  const handleCreateClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleCreateCorrespondence }),
    [asyncHandleCreateCorrespondence, entity],
  );

  return (
    <PageWrapper title={t({ scope: "meta", name: "create" })}>
      <CardTitlePreset
        title={t({ scope: "meta", name: "create" })}
        actions={
          <Button iconLeft="plusLine" size="SMALL" loading={loading} onClick={handleCreateClick}>
            {t({ scope: "create_correspondence", place: "action", name: "create" })}
          </Button>
        }
      />
      <CorrespondenceDetailMainEdit loading={loading} entity={entity} showPermissions={false} />
    </PageWrapper>
  );
}

export default observer(CreateCorrespondenceView);

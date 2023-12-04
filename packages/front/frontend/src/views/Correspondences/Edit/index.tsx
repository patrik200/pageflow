import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";
import { observer } from "mobx-react-lite";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import CardLoadingPreset from "components/Card/pressets/CardLoading";

import { emitRequestError } from "core/emitRequest";

import { EditCorrespondenceEntity } from "core/storages/correspondence/entities/correspondence/EditCorrespondence";

import { CorrespondenceStorage } from "core/storages/correspondence";

import CorrespondenceDetailMainEdit from "../Detail/Tabs/Main/Edit";
import { useLoadCorrespondence } from "../Detail/hooks/useLoad";
import PageWrapper from "../../_PageWrapper";

function EditCorrespondenceView() {
  const { t } = useTranslation("correspondence-detail");

  const correspondenceLoading = useLoadCorrespondence();

  const { updateCorrespondence, correspondenceDetail } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const entity = React.useMemo(
    () =>
      correspondenceDetail
        ? EditCorrespondenceEntity.buildFromCorrespondenceDetailForClient(correspondenceDetail)
        : null,
    [correspondenceDetail],
  );

  const { push } = useRouter();

  const handleUpdateCorrespondence = React.useCallback(async () => {
    const result = await updateCorrespondence(entity!);
    if (result.success) {
      await push.current("/correspondences/" + entity!.options!.id);
      return;
    }

    emitRequestError(
      entity!,
      result.error,
      t({ scope: "edit_correspondence", name: "error_messages", parameter: "unexpected" }),
    );
  }, [entity, push, t, updateCorrespondence]);

  const [{ loading }, asyncHandleUpdateCorrespondence] = useAsyncFn(handleUpdateCorrespondence, [
    handleUpdateCorrespondence,
  ]);

  const handleUpdateClick = React.useCallback(
    () => entity!.submit({ onSuccess: asyncHandleUpdateCorrespondence }),
    [asyncHandleUpdateCorrespondence, entity],
  );

  const handleCancelClick = React.useCallback(
    () => push.current("/correspondences/" + entity!.options!.id),
    [entity, push],
  );

  if (correspondenceLoading || !entity || !correspondenceDetail)
    return (
      <PageWrapper title={t({ scope: "meta", name: "view" }, { name: "" })}>
        <CardLoadingPreset
          title={t({ scope: "meta", name: "view" }, { name: "" })}
          actions={
            <Button size="SMALL" type="WITHOUT_BORDER" loading={loading} onClick={handleCancelClick}>
              {t({ scope: "edit_correspondence", place: "action", name: "cancel" })}
            </Button>
          }
        />
      </PageWrapper>
    );

  return (
    <PageWrapper title={t({ scope: "meta", name: "view" }, { name: correspondenceDetail.name })}>
      <CardTitlePreset
        title={correspondenceDetail.name}
        actions={
          <>
            <Button size="SMALL" type="WITHOUT_BORDER" disabled={loading} onClick={handleCancelClick}>
              {t({ scope: "edit_correspondence", place: "action", name: "cancel" })}
            </Button>
            <Button size="SMALL" loading={loading} onClick={handleUpdateClick}>
              {t({ scope: "edit_correspondence", place: "action", name: "save" })}
            </Button>
          </>
        }
      />
      <CorrespondenceDetailMainEdit loading={loading} entity={entity} showPermissions />
    </PageWrapper>
  );
}

export default observer(EditCorrespondenceView);

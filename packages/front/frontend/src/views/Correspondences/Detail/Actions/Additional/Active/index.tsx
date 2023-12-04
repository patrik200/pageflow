import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import { CorrespondenceStorage } from "core/storages/correspondence";

interface ActiveCorrespondenceActionInterface {
  correspondence: CorrespondenceEntity;
}

function ActiveCorrespondenceAction({ correspondence }: ActiveCorrespondenceActionInterface) {
  const { t } = useTranslation("correspondence-detail");
  const { active } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const handleActive = React.useCallback(async () => {
    const result = await active();
    if (result.success) {
      emitRequestSuccess(t({ scope: "active_correspondence", name: "success_message" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "active_correspondence", name: "error_messages", parameter: "unexpected" }),
    );
  }, [active, t]);

  const [{ loading }, asyncArchive] = useAsyncFn(handleActive, [handleActive]);

  if (!correspondence.canActive) return null;

  return (
    <AdditionalActionButton
      loading={loading}
      text={t({ scope: "edit_correspondence", place: "action", name: "active" })}
      onClick={asyncArchive}
    />
  );
}

export default observer(ActiveCorrespondenceAction);

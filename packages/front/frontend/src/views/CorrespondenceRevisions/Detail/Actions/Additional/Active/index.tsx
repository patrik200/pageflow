import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

function ActiveCorrespondenceRevisionAction() {
  const { t } = useTranslation("correspondence-revision-detail");
  const { revisionDetail, active } = useViewContext().containerInstance.get(CorrespondenceRevisionsStorage);
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
  if (!revisionDetail!.canActiveByStatus) return null;

  return (
    <AdditionalActionButton
      loading={loading}
      text={t({ scope: "view_revision", place: "actions", name: "active" })}
      onClick={asyncActive}
    />
  );
}

export default observer(ActiveCorrespondenceRevisionAction);

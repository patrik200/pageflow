import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import { CorrespondenceStorage } from "core/storages/correspondence";

interface ArchiveCorrespondenceActionInterface {
  correspondence: CorrespondenceEntity;
}

function ArchiveCorrespondenceAction({ correspondence }: ArchiveCorrespondenceActionInterface) {
  const { t } = useTranslation("correspondence-detail");
  const { archive } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const handleArchive = React.useCallback(async () => {
    const result = await archive();
    if (result.success) {
      emitRequestSuccess(t({ scope: "archive_correspondence", name: "success_message" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "archive_correspondence", name: "error_messages", parameter: "unexpected" }),
    );
  }, [archive, t]);

  const [{ loading }, asyncArchive] = useAsyncFn(handleArchive, [handleArchive]);

  if (!correspondence.canArchive) return null;

  return (
    <AdditionalActionButton
      loading={loading}
      text={t({ scope: "edit_correspondence", place: "action", name: "archive" })}
      onClick={asyncArchive}
    />
  );
}

export default observer(ArchiveCorrespondenceAction);

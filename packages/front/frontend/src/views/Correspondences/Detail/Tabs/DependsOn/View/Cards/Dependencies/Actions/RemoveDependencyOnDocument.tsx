import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { CorrespondenceStorage } from "core/storages/correspondence";
import { CorrespondenceDependenciesStorage } from "core/storages/correspondence/dependencies";

interface RemoveDependencyOnDocumentInterface {
  documentId: string;
}

function RemoveDependencyOnDocument({ documentId }: RemoveDependencyOnDocumentInterface) {
  const { t } = useTranslation("correspondence-dependencies");
  const { correspondenceDetail } = useViewContext().containerInstance.get(CorrespondenceStorage);
  const { removeDependency } = useViewContext().containerInstance.get(CorrespondenceDependenciesStorage);

  const handleRemoveDependency = React.useCallback(async () => {
    const result = await removeDependency(correspondenceDetail!.id, documentId);

    if (result.success) {
      emitRequestSuccess(t({ scope: "messages", place: "delete_dependency", name: "success" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "messages", place: "delete_dependency", name: "unexpected_error" }),
    );
  }, [removeDependency, correspondenceDetail, documentId, t]);

  const [{ loading }, asyncHandleRemoveDependency] = useAsyncFn(handleRemoveDependency, [handleRemoveDependency]);

  return (
    <Button
      iconLeft="deleteBinLine"
      loading={loading}
      size="SMALL"
      type="PRIMARY"
      preventDefault={false}
      onClick={asyncHandleRemoveDependency}
    >
      {t({ scope: "actions", place: "delete_dependency", name: "title" })}
    </Button>
  );
}

export default observer(RemoveDependencyOnDocument);

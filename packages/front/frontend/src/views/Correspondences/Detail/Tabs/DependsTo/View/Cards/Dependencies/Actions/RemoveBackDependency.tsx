import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { DocumentEntity } from "core/entities/document/document";

import { CorrespondenceStorage } from "core/storages/correspondence";
import { CorrespondenceDependenciesStorage } from "core/storages/correspondence/dependencies";

interface RemoveDependencyOnCorrespondenceInterface {
  document: DocumentEntity;
}

function RemoveBackDependency({ document }: RemoveDependencyOnCorrespondenceInterface) {
  const { t } = useTranslation("correspondence-dependencies");

  const containerInstance = useViewContext().containerInstance;
  const { correspondenceDetail } = containerInstance.get(CorrespondenceStorage);
  const { removeBackDependency } = containerInstance.get(CorrespondenceDependenciesStorage);

  const handleClick = React.useCallback(async () => {
    const result = await removeBackDependency(correspondenceDetail!.id, document.id);

    if (result.success) {
      emitRequestSuccess(t({ scope: "messages", place: "delete_back_dependency", name: "success" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "messages", place: "delete_back_dependency", name: "unexpected_error" }),
    );
  }, [removeBackDependency, correspondenceDetail, document.id, t]);

  const [{ loading }, asyncUndepend] = useAsyncFn(handleClick, [handleClick]);

  return (
    <Button
      iconLeft="deleteBinLine"
      loading={loading}
      size="SMALL"
      type="PRIMARY"
      preventDefault={false}
      onClick={asyncUndepend}
    >
      {t({ scope: "actions", place: "delete_back_dependency", name: "title" })}
    </Button>
  );
}

export default observer(RemoveBackDependency);

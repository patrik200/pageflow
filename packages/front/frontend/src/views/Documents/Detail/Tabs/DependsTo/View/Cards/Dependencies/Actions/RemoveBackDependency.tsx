import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import { DocumentStorage } from "core/storages/document";
import { DocumentDependenciesStorage } from "core/storages/document/dependencies";

interface RemoveDependencyOnCorrespondenceInterface {
  correspondence: CorrespondenceEntity;
}

function RemoveBackDependency({ correspondence }: RemoveDependencyOnCorrespondenceInterface) {
  const { t } = useTranslation("document-dependencies");

  const containerInstance = useViewContext().containerInstance;
  const { documentDetail } = containerInstance.get(DocumentStorage);
  const { removeBackDependency } = containerInstance.get(DocumentDependenciesStorage);

  const handleClick = React.useCallback(async () => {
    const result = await removeBackDependency(documentDetail!.id, correspondence.id);

    if (result.success) {
      emitRequestSuccess(t({ scope: "messages", place: "delete_back_dependency", name: "success" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "messages", place: "delete_back_dependency", name: "unexpected_error" }),
    );
  }, [removeBackDependency, documentDetail, correspondence.id, t]);

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

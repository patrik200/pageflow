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

function RemoveDependencyOnCorrespondence({ correspondence }: RemoveDependencyOnCorrespondenceInterface) {
  const { t } = useTranslation("document-dependencies");
  const { documentDetail } = useViewContext().containerInstance.get(DocumentStorage);
  const { removeDependency } = useViewContext().containerInstance.get(DocumentDependenciesStorage);

  const handleRemoveDependency = React.useCallback(async () => {
    const result = await removeDependency(documentDetail!.id, correspondence.id);

    if (result.success) {
      emitRequestSuccess(t({ scope: "messages", place: "delete_dependency", name: "success" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "messages", place: "delete_dependency", name: "unexpected_error" }),
    );
  }, [removeDependency, documentDetail, correspondence.id, t]);

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

export default observer(RemoveDependencyOnCorrespondence);

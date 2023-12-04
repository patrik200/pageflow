import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button, TableCell } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { DocumentEntity } from "core/entities/document/document";

import { CorrespondenceStorage } from "core/storages/correspondence";
import { CorrespondenceDependenciesStorage } from "core/storages/correspondence/dependencies";

interface CreateDependencyInterface {
  document: DocumentEntity;
}

function CreateDependency({ document }: CreateDependencyInterface) {
  const { t } = useTranslation("correspondence-dependencies");

  const { containerInstance } = useViewContext();

  const { createDependency } = containerInstance.get(CorrespondenceDependenciesStorage);
  const { correspondenceDetail } = containerInstance.get(CorrespondenceStorage);

  const handleClick = React.useCallback(async () => {
    const result = await createDependency(correspondenceDetail!.id, document);
    if (result.success) {
      emitRequestSuccess(t({ scope: "messages", place: "create_dependency", name: "success" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "messages", place: "create_dependency", name: "unexpected_error" }),
    );
  }, [createDependency, correspondenceDetail, document, t]);

  const [{ loading }, asyncDepend] = useAsyncFn(handleClick, [handleClick]);

  return (
    <TableCell>
      <Button
        iconLeft="plusLine"
        loading={loading}
        size="SMALL"
        type="PRIMARY"
        preventDefault={false}
        onClick={asyncDepend}
      >
        {t({ scope: "actions", place: "create_dependency", name: "from_list" })}
      </Button>
    </TableCell>
  );
}

export default observer(CreateDependency);

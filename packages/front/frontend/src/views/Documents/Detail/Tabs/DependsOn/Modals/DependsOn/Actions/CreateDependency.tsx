import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button, TableCell } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import { DocumentStorage } from "core/storages/document";
import { DocumentDependenciesStorage } from "core/storages/document/dependencies";

interface CreateDependencyInterface {
  correspondence: CorrespondenceEntity;
}

function CreateDependency({ correspondence }: CreateDependencyInterface) {
  const { t } = useTranslation("document-dependencies");
  const { documentDetail } = useViewContext().containerInstance.get(DocumentStorage);
  const { createDependency } = useViewContext().containerInstance.get(DocumentDependenciesStorage);

  const handleClick = React.useCallback(async () => {
    const result = await createDependency(documentDetail!.id, correspondence);
    if (result.success) {
      emitRequestSuccess(t({ scope: "messages", place: "create_dependency", name: "success" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "messages", place: "create_dependency", name: "unexpected_error" }),
    );
  }, [createDependency, documentDetail, correspondence, t]);

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

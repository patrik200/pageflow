import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import MoveModalContentTemplate, {
  MoveModalContentTemplateBreadcrumb,
  MoveModalContentTemplateGroup,
} from "components/MoveModalContentTemplate";

import { emitRequestError } from "core/emitRequest";

import { DocumentEntity } from "core/entities/document/document";
import { DocumentFilterEntity } from "core/storages/document/entities/document/DocumentFilter";

import { DocumentStorage } from "core/storages/document";

import { useMoveTable } from "../../MoveGroup/ModalContent/commonHooks";

interface MoveDocumentModalContentInterface {
  document: DocumentEntity;
  initialFilter: DocumentFilterEntity;
  close: () => void;
  onSuccess?: () => void;
}

function MoveDocumentModalContent({
  document: movableDocument,
  initialFilter,
  close,
  onSuccess,
}: MoveDocumentModalContentInterface) {
  const { t } = useTranslation("document");
  const { moveDocument } = useViewContext().containerInstance.get(DocumentStorage);
  const [table, filter] = useMoveTable(initialFilter);

  const handleMove = React.useCallback(
    async (targetGroupId: string | null) => {
      const result = await moveDocument(movableDocument.id, targetGroupId);
      if (result.success) {
        close();
        onSuccess?.();
        return;
      }

      emitRequestError(
        undefined,
        result.error,
        t(
          { scope: "move_modal", name: "error_messages", parameter: "unexpected_document" },
          { name: movableDocument.name },
        ),
      );
    },
    [close, movableDocument.id, movableDocument.name, moveDocument, onSuccess, t],
  );

  const [{ loading: moveLoading }, asyncHandleMove] = useAsyncFn(handleMove, [handleMove]);

  const breadcrumbs = React.useMemo<MoveModalContentTemplateBreadcrumb[]>(() => {
    const rootBreadcrumb: MoveModalContentTemplateBreadcrumb = {
      name: t({ scope: "breadcrumbs", name: "root_document" }),
      id: null,
    };
    if (!table?.results?.groupsPath) return [rootBreadcrumb];
    return [rootBreadcrumb, ...table.results.groupsPath];
  }, [t, table?.results?.groupsPath]);

  const groups = React.useMemo<MoveModalContentTemplateGroup[]>(
    () => table?.results?.documentGroups ?? [],
    [table?.results?.documentGroups],
  );

  return (
    <MoveModalContentTemplate
      title={t({ scope: "move_modal", name: "title", parameter: "document" }, { name: movableDocument.name })}
      breadcrumbs={breadcrumbs}
      moveLoading={moveLoading}
      changeFolderLoading={false}
      initialGroupId={initialFilter.parentGroupId}
      currentGroupId={filter.parentGroupId}
      groups={groups}
      onChangeGroup={filter.setParentGroupId}
      onMove={asyncHandleMove}
    />
  );
}

export default observer(MoveDocumentModalContent);

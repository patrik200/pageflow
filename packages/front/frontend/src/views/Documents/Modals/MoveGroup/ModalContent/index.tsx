import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import MoveModalContentTemplate, {
  MoveModalContentTemplateBreadcrumb,
  MoveModalContentTemplateGroup,
} from "components/MoveModalContentTemplate";

import { emitRequestError } from "core/emitRequest";

import { DocumentGroupEntity } from "core/entities/document/group";
import { DocumentFilterEntity } from "core/storages/document/entities/document/DocumentFilter";

import { DocumentStorage } from "core/storages/document";

import { useMoveTable } from "./commonHooks";

interface MoveDocumentGroupModalContentInterface {
  group: DocumentGroupEntity;
  initialFilter: DocumentFilterEntity;
  close: () => void;
  onSuccess?: () => void;
}

function MoveDocumentGroupModalContent({
  group: movableGroup,
  initialFilter,
  close,
  onSuccess,
}: MoveDocumentGroupModalContentInterface) {
  const { t } = useTranslation("document");
  const { moveGroup } = useViewContext().containerInstance.get(DocumentStorage);
  const [table, filter] = useMoveTable(initialFilter);

  const handleMove = React.useCallback(
    async (targetGroupId: string | null) => {
      const result = await moveGroup(movableGroup.id, targetGroupId);
      if (result.success) {
        close();
        onSuccess?.();
        return;
      }

      emitRequestError(
        undefined,
        result.error,
        t({ scope: "move_modal", name: "error_messages", parameter: "unexpected_group" }, { name: movableGroup.name }),
      );
    },
    [close, movableGroup.id, movableGroup.name, moveGroup, onSuccess, t],
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
    () => table?.results?.documentGroups?.filter((group) => group.id !== movableGroup.id) ?? [],
    [movableGroup.id, table?.results?.documentGroups],
  );

  return (
    <MoveModalContentTemplate
      title={t({ scope: "move_modal", name: "title", parameter: "group" }, { name: movableGroup.name })}
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

export default observer(MoveDocumentGroupModalContent);

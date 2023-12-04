import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import MoveModalContentTemplate, {
  MoveModalContentTemplateBreadcrumb,
  MoveModalContentTemplateGroup,
} from "components/MoveModalContentTemplate";

import { emitRequestError } from "core/emitRequest";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";
import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

import { CorrespondenceStorage } from "core/storages/correspondence";

import { useMoveTable } from "./commonHooks";

interface CorrespondenceGroupMoveModalContentInterface {
  group: CorrespondenceGroupEntity;
  initialFilter: CorrespondenceFilterEntity;
  close: () => void;
  onSuccess?: () => void;
}

function CorrespondenceGroupMoveModalContent({
  group: movableGroup,
  initialFilter,
  close,
  onSuccess,
}: CorrespondenceGroupMoveModalContentInterface) {
  const { t } = useTranslation("correspondence");
  const { moveGroup } = useViewContext().containerInstance.get(CorrespondenceStorage);
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
      name: t({ scope: "breadcrumbs", name: "root_correspondence" }),
      id: null,
    };
    if (!table?.results?.groupsPath) return [rootBreadcrumb];
    return [rootBreadcrumb, ...table.results.groupsPath];
  }, [t, table?.results?.groupsPath]);

  const groups = React.useMemo<MoveModalContentTemplateGroup[]>(
    () => table?.results?.correspondenceGroups?.filter((group) => group.id !== movableGroup.id) ?? [],
    [movableGroup.id, table?.results?.correspondenceGroups],
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

export default observer(CorrespondenceGroupMoveModalContent);

import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import MoveModalContentTemplate, {
  MoveModalContentTemplateBreadcrumb,
  MoveModalContentTemplateGroup,
} from "components/MoveModalContentTemplate";

import { emitRequestError } from "core/emitRequest";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";
import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

import { CorrespondenceStorage } from "core/storages/correspondence";

import { useMoveTable } from "../../MoveGroup/ModalContent/commonHooks";

interface CorrespondenceMoveModalContentInterface {
  correspondence: CorrespondenceEntity;
  initialFilter: CorrespondenceFilterEntity;
  close: () => void;
  onSuccess?: () => void;
}

function CorrespondenceMoveModalContent({
  correspondence: movableCorrespondence,
  initialFilter,
  close,
  onSuccess,
}: CorrespondenceMoveModalContentInterface) {
  const { t } = useTranslation("correspondence");
  const { moveCorrespondence } = useViewContext().containerInstance.get(CorrespondenceStorage);
  const [table, filter] = useMoveTable(initialFilter);

  const handleMove = React.useCallback(
    async (targetGroupId: string | null) => {
      const result = await moveCorrespondence(movableCorrespondence.id, targetGroupId);
      if (result.success) {
        close();
        onSuccess?.();
        return;
      }

      emitRequestError(
        undefined,
        result.error,
        t(
          { scope: "move_modal", name: "error_messages", parameter: "unexpected_correspondence" },
          { name: movableCorrespondence.name },
        ),
      );
    },
    [close, movableCorrespondence.id, movableCorrespondence.name, moveCorrespondence, onSuccess, t],
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
    () => table?.results?.correspondenceGroups ?? [],
    [table?.results?.correspondenceGroups],
  );

  return (
    <MoveModalContentTemplate
      title={t(
        { scope: "move_modal", name: "title", parameter: "correspondence" },
        { name: movableCorrespondence.name },
      )}
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

export default observer(CorrespondenceMoveModalContent);

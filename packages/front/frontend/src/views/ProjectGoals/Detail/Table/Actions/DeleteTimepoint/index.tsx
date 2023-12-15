import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";

import { emitRequestError } from "core/emitRequest";

import { TimepointEntity } from "core/entities/goal/timepoint";

import { GoalStorage } from "core/storages/goal";

interface DeleteTimepointActionInterface {
  entity: TimepointEntity;
}

function DeleteButton({ entity }: DeleteTimepointActionInterface) {
  const { deleteTimepoint } = useViewContext().containerInstance.get(GoalStorage);
  const { loadGoals } = useViewContext().containerInstance.get(GoalStorage);
  const { query } = useRouter();
  const [{ loading }, asyncDeleteTimepoint] = useAsyncFn(deleteTimepoint, [deleteTimepoint]);
  const { t } = useTranslation("goal-detail");
  const handleDelete = React.useCallback(async () => {
    const result = await asyncDeleteTimepoint(entity.id);
    if (result.success) {
      loadGoals(query.id as string);
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "time_point_tab", place: "unexpected_errors", name: "delete" }),
    );
  }, [t, entity.id, asyncDeleteTimepoint, loadGoals, query.id]);

  return (
    <Button size="SMALL" iconLeft="deleteBinLine" type="WITHOUT_BORDER" loading={loading} onClick={handleDelete} />
  );
}

export default DeleteButton;

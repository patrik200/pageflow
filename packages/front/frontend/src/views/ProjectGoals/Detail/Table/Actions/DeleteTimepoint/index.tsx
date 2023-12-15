import { useRouter, useViewContext } from "@app/front-kit";
import { GoalStorage } from "core/storages/goal";
import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { TimepointEntity } from "core/entities/goal/timepoint";
import { Button } from "@app/ui-kit";
import { emitRequestError } from "core/emitRequest";

interface DeleteTimepointActionInterface {
  entity: TimepointEntity;
  onOpenedChange: (opened: boolean) => void;
}

function DeleteButton({ entity, onOpenedChange }: DeleteTimepointActionInterface) {
  const { deleteTimepoint } = useViewContext().containerInstance.get(GoalStorage);
  const { loadGoals } = useViewContext().containerInstance.get(GoalStorage);
  const { query } = useRouter();
  const [{ loading }, asyncDeleteTimepoint] = useAsyncFn(deleteTimepoint, [deleteTimepoint]);

  const handleDelete = React.useCallback(async () => {
    const result = await asyncDeleteTimepoint(entity.id);
    if (result.success) {
      loadGoals(query.id as string)
      return;
    }

    emitRequestError(undefined, result.error, "Перевод сюды не может быть удалён");
  }, []);

  return (
    <Button size="SMALL" iconLeft="deleteBinLine" type="WITHOUT_BORDER" loading={loading} onClick={handleDelete} />
  );
}

export default DeleteButton;

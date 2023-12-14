import { useViewContext } from "@app/front-kit";
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
  
  const [{loading}, asyncDeleteTimepoint] = useAsyncFn(deleteTimepoint, [deleteTimepoint])
  
  const handleDelete = React.useCallback(async () => {
    const result = await asyncDeleteTimepoint(entity.id)
    if (result.success) {return}

    emitRequestError(undefined, result.error, "Перевод сюды не может быть удалён")
  }, []);

  return (
    <Button iconLeft="deleteBinLine" type="WITHOUT_BORDER" loading={loading} onClick={handleDelete} />
  );
};

export default DeleteButton;
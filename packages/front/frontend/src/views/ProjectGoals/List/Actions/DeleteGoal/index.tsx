import { useViewContext } from "@app/front-kit";
import { GoalStorage } from "core/storages/goal";
import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { TimepointEntity } from "core/entities/goal/timepoint";
import { Button } from "@app/ui-kit";
import { emitRequestError } from "core/emitRequest";
import { GoalEntity } from "core/entities/goal/goal";
import { buttonStyles } from "./style.css";
interface DeleteGoalActionInterface {
    entity: GoalEntity;
  }
  

function DeleteButton({ entity }: DeleteGoalActionInterface) {
  const { deleteGoal } = useViewContext().containerInstance.get(GoalStorage);
  
  const [{loading}, asyncDeleteTimepoint] = useAsyncFn(deleteGoal, [deleteGoal])
  
  const handleDelete = React.useCallback(async () => {
    const result = await asyncDeleteTimepoint(entity.id)
    if (result.success) {return}

    emitRequestError(undefined, result.error, "Перевод сюды не может быть удалён")
  }, []);

  return (
    <Button className={buttonStyles} size="SMALL" type="PRIMARY" loading={loading} onClick={handleDelete} > Удал </Button>
  );
};

export default DeleteButton;
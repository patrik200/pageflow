import { useRouter, useViewContext } from "@app/front-kit";
import { GoalStorage } from "core/storages/goal";
import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { TimepointEntity } from "core/entities/goal/timepoint";
import { Button } from "@app/ui-kit";
import { emitRequestError } from "core/emitRequest";
import { GoalEntity } from "core/entities/goal/goal";
import { buttonStyles } from "./style.css";
import { useReorder } from "views/Settings/DictionariesView/DictionaryCard/hooks";
interface DeleteGoalActionInterface {
    entity: GoalEntity;
  }
  

function DeleteButton({ entity }: DeleteGoalActionInterface) {
  const { deleteGoal, loadGoals } = useViewContext().containerInstance.get(GoalStorage);
  const { query } = useRouter()
  const [{loading}, asyncDeleteGoal] = useAsyncFn(deleteGoal, [deleteGoal])
  
  const handleDelete = React.useCallback(async () => {
    const result = await asyncDeleteGoal(entity.id)
    if (result.success) {
      loadGoals(query.id as string)
      return
    }

    emitRequestError(undefined, result.error, "Перевод сюды не может быть удалён")
  }, []);

  return (
    <Button className={buttonStyles} size="SMALL" type="PRIMARY" loading={loading} onClick={handleDelete} > Удал </Button>
  );
};

export default DeleteButton;
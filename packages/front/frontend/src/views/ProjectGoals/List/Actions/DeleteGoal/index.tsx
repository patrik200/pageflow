import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";

import { emitRequestError } from "core/emitRequest";

import { GoalEntity } from "core/entities/goal/goal";

import { GoalStorage } from "core/storages/goal";

import { buttonStyles } from "./style.css";

interface DeleteGoalActionInterface {
  entity: GoalEntity;
}

function DeleteButton({ entity }: DeleteGoalActionInterface) {
  const { t } = useTranslation("goal-detail");
  const { deleteGoal, loadGoals } = useViewContext().containerInstance.get(GoalStorage);
  const { query } = useRouter();
  const [{ loading }, asyncDeleteGoal] = useAsyncFn(deleteGoal, [deleteGoal]);

  const handleDelete = React.useCallback(async () => {
    const result = await asyncDeleteGoal(entity.id);
    if (result.success) {
      loadGoals(query.id as string);
      return;
    }

    emitRequestError(undefined, result.error, t({ scope: "main_tab", place: "unexpected_errors", name: "delete" }));
  }, [t, entity.id, asyncDeleteGoal, loadGoals, query.id]);

  return (
    <Button className={buttonStyles} size="SMALL" type="PRIMARY" loading={loading} onClick={handleDelete}>
      {t({ scope: "main_tab", place: "actions", name: "delete" })}
    </Button>
  );
}

export default DeleteButton;

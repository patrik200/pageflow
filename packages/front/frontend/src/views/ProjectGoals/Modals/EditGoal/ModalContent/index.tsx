import React from "react";
import { useRouter, useViewContext } from "@app/front-kit";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { GoalEntity } from "core/entities/goal/goal";
import { EditGoalEntity } from "core/storages/goal/entities/EditGoal";
import GroupedContent from "components/FormField/GroupedContent";
import Text from "components/FormField/Text";
import { GoalStorage } from "core/storages/goal";
import { emitRequestError } from "core/emitRequest";
import { useAsyncFn } from "@worksolutions/react-utils";
import { observer } from "mobx-react-lite";

interface ModalContentInterface {
  goal?: GoalEntity;
  close: () => void;
  onSuccess?: () => void;
}

function ModalContent({ goal, close, onSuccess }: ModalContentInterface) {
  const { query } = useRouter();
  const { createGoal, updateGoal } = useViewContext().containerInstance.get(GoalStorage);

  const entity = React.useMemo(
    () => (goal ? EditGoalEntity.buildFromGoal(goal) : EditGoalEntity.buildEmpty(query.id as string)),
    [goal, query],
  );

  const handleSaveGoal = React.useCallback(async () => {
    const result = goal ? await updateGoal(entity.options.id!, entity) : await createGoal(entity);

    if (result.success) {
      close();
      onSuccess?.();
      return;
    }

    emitRequestError(undefined, result.error, "Unexpected error");
  }, [close, createGoal, entity, goal, onSuccess, updateGoal]);

  const [{ loading }, asyncHandleUpdateGoal] = useAsyncFn(handleSaveGoal, [handleSaveGoal]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleUpdateGoal }),
    [asyncHandleUpdateGoal, entity],
  );

  return (
    <>
      <ModalTitle>Create</ModalTitle>
      <GroupedContent>
        <Text edit value={entity.name} onChange={entity.setName} />
        <Text edit value={entity.description} onChange={entity.setDescription} />
      </GroupedContent>
      <ModalActions primaryActionText="Save" primaryActionLoading={loading} onPrimaryActionClick={handleSaveClick} />
    </>
  );
}

export default observer(ModalContent);

import React from "react";
import { useRouter, useViewContext } from "@app/front-kit";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { TimepointEntity } from "core/entities/goal/timepoint";
import { EditGoalEntity } from "core/storages/goal/entities/EditGoal";
import GroupedContent from "components/FormField/GroupedContent";
import Text from "components/FormField/Text";
import { GoalStorage } from "core/storages/goal";
import { emitRequestError } from "core/emitRequest";
import { useAsyncFn } from "@worksolutions/react-utils";
import { observer } from "mobx-react-lite";
import { EditTimepointEntity } from "core/storages/goal/entities/EditTimepoint";
import Date from "components/FormField/Date";

interface ModalContentInterface {
  goalId?: string; 
  timepoint?: TimepointEntity;
  close: () => void;
  onSuccess?: () => void;
}

function ModalContent({ timepoint, goalId, close, onSuccess }: ModalContentInterface) {
  const { createTimepoint, updateTimepoint } = useViewContext().containerInstance.get(GoalStorage);

  const entity = React.useMemo(
    () => (timepoint ? EditTimepointEntity.buildFromTimepoint(timepoint) : EditTimepointEntity.buildEmpty(goalId!)),
    [timepoint, goalId],
  );

  const handleSaveTimepoint = React.useCallback(async () => {
    const result = timepoint ? await updateTimepoint(entity.options.id!, entity) : await createTimepoint(entity);

    if (result.success) {
      close();
      onSuccess?.();
      return;
    }

    emitRequestError(undefined, result.error, "Unexpected error");
  }, [close, createTimepoint, entity, timepoint, onSuccess, updateTimepoint]);

  const [{ loading }, asyncHandleUpdateTimepoint] = useAsyncFn(handleSaveTimepoint, [handleSaveTimepoint]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleUpdateTimepoint }),
    [asyncHandleUpdateTimepoint, entity],
  );

  return (
    <>
      <ModalTitle>Create</ModalTitle>
      <GroupedContent>
        <Text edit value={entity.name} onChange={entity.setName} />
        <Text edit value={entity.description} onChange={entity.setDescription} />
        <Date edit value={entity.startDateFact} onChange={entity.setStartDateFact} />
        <Date edit value={entity.startDatePlan} onChange={entity.setStartDatePlan} />
      </GroupedContent>
      <ModalActions primaryActionText="Save" primaryActionLoading={loading} onPrimaryActionClick={handleSaveClick} />
    </>
  );
}

export default observer(ModalContent);

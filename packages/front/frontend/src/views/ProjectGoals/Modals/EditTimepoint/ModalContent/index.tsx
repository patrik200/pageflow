import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { ModalActions, ModalTitle, TextField} from "@app/ui-kit";
import { TimepointEntity } from "core/entities/goal/timepoint";
import { EditGoalEntity } from "core/storages/goal/entities/EditGoal";
import GroupedContent from "components/FormField/GroupedContent";
import { GoalStorage } from "core/storages/goal";
import { emitRequestError } from "core/emitRequest";
import { useAsyncFn } from "@worksolutions/react-utils";
import { observer } from "mobx-react-lite";
import { EditTimepointEntity } from "core/storages/goal/entities/EditTimepoint";
import Date from "components/FormField/Date";
import { wrapperStyles } from "./style.css";

interface ModalContentInterface {
  goalId?: string; 
  timepoint?: TimepointEntity;
  close: () => void;
  onSuccess?: () => void;
}

function ModalContent({ timepoint, goalId, close, onSuccess }: ModalContentInterface) {
  const { createTimepoint, updateTimepoint } = useViewContext().containerInstance.get(GoalStorage);
  const { t } = useTranslation("goal-detail");
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
    <div className={wrapperStyles}>
      <ModalTitle>{t({scope: "modals", place: "timepoints", name: "title", parameter: timepoint ? "edit": "create"},{name: timepoint?.name})}</ModalTitle>
      <GroupedContent>
        <TextField placeholder={t({ scope: "time_point_tab", name: "name_field", parameter: "placeholder" })} value={entity.name} onChange={entity.setName} />
        <TextField placeholder={t({ scope: "time_point_tab", name: "description_field", parameter: "placeholder" })} value={entity.description} onChange={entity.setDescription} />
        <Date edit value={entity.startDateFact} onChange={entity.setStartDateFact} />
        <Date edit value={entity.startDatePlan} onChange={entity.setStartDatePlan} />
      </GroupedContent>
      <ModalActions primaryActionText={t({scope: "modals", place: "timepoints", name: "actions", parameter: "save"})} primaryActionLoading={loading} onPrimaryActionClick={handleSaveClick} />
    </div>
    </>
  );
}

export default observer(ModalContent);

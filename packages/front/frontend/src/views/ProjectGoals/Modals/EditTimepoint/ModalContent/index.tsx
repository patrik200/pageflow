import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { observer } from "mobx-react-lite";

import TextField from "components/FormField/Text";
import GroupedContent from "components/FormField/GroupedContent";
import Date from "components/FormField/Date";

import { emitRequestError } from "core/emitRequest";

import { TimepointEntity } from "core/entities/goal/timepoint";
import { EditTimepointEntity } from "core/storages/goal/entities/EditTimepoint";

import { GoalStorage } from "core/storages/goal";

import { wrapperStyles } from "./style.css";

interface ModalContentInterface {
  goalId?: string;
  timepoint?: TimepointEntity;
  close: () => void;
  onSuccess?: () => void;
}

function ModalContent({ timepoint, goalId, close, onSuccess }: ModalContentInterface) {
  const { createTimepoint, updateTimepoint, loadGoals } = useViewContext().containerInstance.get(GoalStorage);
  const { query } = useRouter();
  const { t } = useTranslation("goal-detail");
  const entity = React.useMemo(
    () => (timepoint ? EditTimepointEntity.buildFromTimepoint(timepoint) : EditTimepointEntity.buildEmpty(goalId!)),
    [timepoint, goalId],
  );

  const handleSaveTimepoint = React.useCallback(async () => {
    const result = timepoint ? await updateTimepoint(entity.options.id!, entity) : await createTimepoint(entity);

    if (result.success) {
      loadGoals(query.id as string);
      close();
      onSuccess?.();
      return;
    }

    emitRequestError(undefined, result.error, t({ scope: "modals", place: "timepoints", name: "unexpected_error" }));
  }, [t, timepoint, updateTimepoint, entity, createTimepoint, loadGoals, query, close, onSuccess]);

  const [{ loading }, asyncHandleUpdateTimepoint] = useAsyncFn(handleSaveTimepoint, [handleSaveTimepoint]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleUpdateTimepoint }),
    [asyncHandleUpdateTimepoint, entity],
  );

  return (
    <>
      <div className={wrapperStyles}>
        <ModalTitle>
          {t(
            { scope: "modals", place: "timepoints", name: "title", parameter: timepoint ? "edit" : "create" },
            { name: timepoint?.name },
          )}
        </ModalTitle>
        <GroupedContent>
          <TextField
            edit
            errorMessage={entity.viewErrors.name}
            placeholder={t({ scope: "time_point_tab", name: "name_field", parameter: "placeholder" })}
            value={entity.name}
            onChange={entity.setName}
          />
          <TextField
            edit
            placeholder={t({ scope: "time_point_tab", name: "description_field", parameter: "placeholder" })}
            value={entity.description}
            onChange={entity.setDescription}
          />
          <Date edit errorMessage={entity.viewErrors.datePlan} value={entity.datePlan} onChange={entity.setDatePlan} />
        </GroupedContent>
        <ModalActions
          primaryActionText={t({ scope: "modals", place: "timepoints", name: "actions", parameter: "save" })}
          primaryActionLoading={loading}
          onPrimaryActionClick={handleSaveClick}
        />
      </div>
    </>
  );
}

export default observer(ModalContent);

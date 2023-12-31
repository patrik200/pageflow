import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { observer } from "mobx-react-lite";

import GroupedContent from "components/FormField/GroupedContent";
import TextField from "components/FormField/Text";

import { emitRequestError } from "core/emitRequest";

import { GoalEntity } from "core/entities/goal/goal";
import { EditGoalEntity } from "core/storages/goal/entities/EditGoal";

import { GoalStorage } from "core/storages/goal";

import { wrapperStyles } from "./style.css";

interface ModalContentInterface {
  goal?: GoalEntity;
  close: () => void;
  onSuccess?: () => void;
}

function ModalContent({ goal, close, onSuccess }: ModalContentInterface) {
  const { query } = useRouter();
  const { createGoal, updateGoal, loadGoals } = useViewContext().containerInstance.get(GoalStorage);
  const { t } = useTranslation("goal-detail");
  const entity = React.useMemo(
    () => (goal ? EditGoalEntity.buildFromGoal(goal) : EditGoalEntity.buildEmpty(query.id as string)),
    [goal, query],
  );

  const handleSaveGoal = React.useCallback(async () => {
    const result = goal ? await updateGoal(entity.options.id!, entity) : await createGoal(entity);

    if (result.success) {
      loadGoals(query.id as string);
      close();
      onSuccess?.();
      return;
    }

    emitRequestError(undefined, result.error, t({ scope: "modals", place: "goals", name: "unexpected_error" }));
  }, [t, close, createGoal, entity, goal, loadGoals, onSuccess, query.id, updateGoal]);

  const [{ loading }, asyncHandleUpdateGoal] = useAsyncFn(handleSaveGoal, [handleSaveGoal]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleUpdateGoal }),
    [asyncHandleUpdateGoal, entity],
  );

  return (
    <div className={wrapperStyles}>
      <ModalTitle>
        {t(
          { scope: "modals", place: "goals", name: "title", parameter: goal ? "edit" : "create" },
          { name: goal?.name },
        )}
      </ModalTitle>
      <GroupedContent>
        <TextField
          edit
          errorMessage={entity.viewErrors.name}
          placeholder={t({ scope: "main_tab", name: "name_field", parameter: "placeholder" })}
          value={entity.name}
          onChange={entity.setName}
        />
        <TextField
          edit
          placeholder={t({ scope: "main_tab", name: "description_field", parameter: "placeholder" })}
          value={entity.description}
          onChange={entity.setDescription}
        />
      </GroupedContent>
      <ModalActions
        primaryActionText={t({ scope: "modals", place: "goals", name: "actions", parameter: "save" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleSaveClick}
      />
    </div>
  );
}

export default observer(ModalContent);

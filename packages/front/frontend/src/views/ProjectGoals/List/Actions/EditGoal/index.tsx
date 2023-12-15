import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";
import { useTranslation } from "@app/front-kit";

import EditGoalModal from "views/ProjectGoals/Modals/EditGoal";
import { buttonStyles } from "./style.css";
import Card from "components/Card";
import { GoalEntity } from "core/entities/goal/goal";

interface EditGoalInterface {
  entity: GoalEntity
}

function EditGoalAction({ entity } : EditGoalInterface) {
  const [opened, onOpen, onClose] = useBoolean(false);
  const { t } = useTranslation("goal-detail");

  return (
    <>
      <Button size="SMALL" type="PRIMARY" onClick={onOpen} className={buttonStyles}>
        {/* {t({ scope: "edit_goal", place: "actions", name: "create" })} */}Редактировать
      </Button>
      <EditGoalModal goal={entity} opened={opened} close={onClose} />
    </>
  );
}

export default observer(EditGoalAction);
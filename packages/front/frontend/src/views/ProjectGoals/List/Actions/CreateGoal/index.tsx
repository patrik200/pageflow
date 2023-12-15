import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";
import { useTranslation } from "@app/front-kit";

import Card from "components/Card";

import EditGoalModal from "views/ProjectGoals/Modals/EditGoal";

import { buttonStyles } from "./style.css";

function CreateGoalAction() {
  const [opened, onOpen, onClose] = useBoolean(false);
  const { t } = useTranslation("goal-detail");

  return (
    <Card>
      <Button size="SMALL" type="PRIMARY" onClick={onOpen} className={buttonStyles}>
        {t({ scope: "create_goal", place: "actions", name: "create" })}
      </Button>
      <EditGoalModal opened={opened} close={onClose} />
    </Card>
  );
}

export default observer(CreateGoalAction);

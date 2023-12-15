import React from "react";
import { observer } from "mobx-react-lite";
import { useToggle } from "@worksolutions/react-utils";

import Card from "components/Card";

import Table from "./Table";
import GoalActions from "../List/Actions";
import {
  lineStyles,
  pointStyles,
  wrapperStyles,
  nameStyles,
  descriptionStyles,
  lineWrapperStyles,
  buttonStyles,
  titleWrapperStyles,
} from "./style.css";
import { Button } from "@app/ui-kit";
import { GoalEntity } from "core/entities/goal/goal";
import { useTranslation } from "@app/front-kit";

interface GoalsDetailInterface {
  goal: GoalEntity;
}

function GoalsDetail({ goal }: GoalsDetailInterface) {
  const { t } = useTranslation("goal-detail");
  const [opened, toggle] = useToggle(false);

  return (
    <Card className={wrapperStyles}>
      <div className={titleWrapperStyles}><div className={nameStyles}>{goal.name}</div>
        <GoalActions goal={goal} />
      </div>
      <div className={descriptionStyles}>{goal.description}</div>
      <div className={lineWrapperStyles}>
        <div className={lineStyles}>
          <div className={pointStyles} />
          {goal.timepoints.map((timepoint, index) => (
            <div>
              <div key={index} className={pointStyles} />
              <div>{index + 1}</div>
            </div>
          ))}
          <div className={pointStyles} />
        </div>
        <Button
          size="SMALL"
          type="WITHOUT_BORDER"
          iconLeft={opened ? "arrowUpSLine" : "arrowDownSLine"}
          onClick={toggle}
          className={buttonStyles}
        >
          {t({ scope: "main_tab", place: "actions", name: "more" })}
        </Button>
      </div>
      <Table goal={goal} opened={opened} />
    </Card>
  );
}

export default observer(GoalsDetail);

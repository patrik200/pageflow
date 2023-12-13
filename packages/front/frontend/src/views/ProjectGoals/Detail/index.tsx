import React from "react";
import { observer } from "mobx-react-lite";
import { useToggle } from "@worksolutions/react-utils";

import Card from "components/Card";

import Table from "./Table";

import {
  lineStyles,
  pointStyles,
  wrapperStyles,
  nameStyles,
  descriptionStyles,
  lineWrapperStyles,
  buttonStyles,
} from "./style.css";
import { Button } from "@app/ui-kit";

interface GoalsDetailInterface {
  goal: any;
}

function GoalsDetail({ goal }: GoalsDetailInterface) {
  const [opened, toggle] = useToggle(false);

  return (
    <Card className={wrapperStyles}>
      <div className={nameStyles}>{goal.name}</div>
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
          Подробгеео
        </Button>
      </div>
      <Table goal={goal} opened={opened} />
    </Card>
  );
}

export default observer(GoalsDetail);

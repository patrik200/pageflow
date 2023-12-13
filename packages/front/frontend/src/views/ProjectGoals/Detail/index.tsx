import React from "react";
import { observer } from "mobx-react-lite";

import Card from "components/Card";

import Table from "./Table";

import { lineStyles, pointStyles, wrapperStyles, nameStyles, descriptionStyles } from "./style.css";

interface GoalsDetailInterface {
  goal: any;
}

function GoalsDetail({ goal }: GoalsDetailInterface) {
  return (
    <Card className={wrapperStyles}>
      <div className={nameStyles}>{goal.name}</div>
      <div className={descriptionStyles}>{goal.description}</div>
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
      <Table goal={goal} />
    </Card>
  );
}

export default observer(GoalsDetail);

import React from "react";
import { observer } from "mobx-react-lite";

import Card from "components/Card";

import { lineStyles, pointNameStyles, pointNamesWrapperStyles, pointStyles, wrapperStyles } from "./style.css";
import Table from "./Table";

interface GoalsDetailInterface {
  goal: any;
}

function GoalsDetail({ goal }: GoalsDetailInterface) {
  return (
    <Card className={wrapperStyles}>
      <div>{goal.name}</div>
      <div>{goal.description}</div>
      <div className={lineStyles}>
        <div className={pointStyles} />
        {goal.timepoints.map((timepoint, index) => (
          <div key={index} className={pointStyles} />
        ))}
        <div className={pointStyles} />
      </div>
      <div className={pointNamesWrapperStyles}>
        <div className={pointNameStyles} />
        {goal.timepoints.map((timepoint, index) => (
          <div key={index} className={pointNameStyles}>
            {timepoint.name}
          </div>
        ))}
        <div className={pointNameStyles} />
      </div>
      <Table goal={goal} />
    </Card>
  );
}

export default observer(GoalsDetail);

import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";

import CardTitle from "components/Card/pressets/CardTitle";

import { textStyles } from "./style.css";

interface StatisticsCardInterface {
  title: string;
  value: number;
}

function StatisticsCard({ title, value }: StatisticsCardInterface) {
  return (
    <CardTitle title={title} size="small">
      <Typography className={textStyles}>{value}</Typography>
    </CardTitle>
  );
}

export default observer(StatisticsCard);

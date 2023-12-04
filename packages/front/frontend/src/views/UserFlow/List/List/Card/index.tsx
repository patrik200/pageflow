import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import Card from "components/Card";
import UserFlowView from "components/UserFlowView";

import { UserFlowEntity } from "core/entities/userFlow/userFlow";

import UserFlowCardActions from "./Actions";

import { wrapperStyles } from "./style.css";

interface UserFlowCardInterface {
  userFlow: UserFlowEntity;
}

function UserFlowCard({ userFlow }: UserFlowCardInterface) {
  const { t } = useTranslation("user-flow");

  return (
    <Card className={wrapperStyles}>
      <UserFlowCardActions userFlow={userFlow} />
      <UserFlowView
        name={userFlow.name}
        deadlineDaysAmount={userFlow.deadlineDaysAmount}
        deadlineDaysIncludeWeekends={userFlow.deadlineDaysIncludeWeekends}
        rows={userFlow.rows}
        reviewer={userFlow.reviewer?.user}
        reviewerPlaceholder={t({ scope: "user_flow_card", place: "reviewer", name: "placeholder" })}
      />
    </Card>
  );
}

export default observer(UserFlowCard);

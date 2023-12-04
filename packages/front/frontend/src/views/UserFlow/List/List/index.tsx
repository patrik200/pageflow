import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import { UserFlowStorage } from "core/storages/user-flow";

import UserFlowCard from "./Card";

function UserFlowList() {
  const { userFlows } = useViewContext().containerInstance.get(UserFlowStorage);

  return (
    <>
      {userFlows.map((userFlow) => (
        <UserFlowCard key={userFlow.id} userFlow={userFlow} />
      ))}
    </>
  );
}

export default observer(UserFlowList);

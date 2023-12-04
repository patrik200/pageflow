import React from "react";
import { observer } from "mobx-react-lite";

import CreateUserFlowAction from "./Create";

function UserFlowActions() {
  return <CreateUserFlowAction />;
}

export default observer(UserFlowActions);

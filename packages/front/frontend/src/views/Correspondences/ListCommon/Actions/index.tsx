import React from "react";
import { observer } from "mobx-react-lite";

import CreateGroupAction from "./CreateGroup";
import CreateCorrespondenceAction from "./CreateCorrespondence";

function CorrespondenceActions() {
  return (
    <>
      <CreateGroupAction />
      <CreateCorrespondenceAction />
    </>
  );
}

export default observer(CorrespondenceActions);

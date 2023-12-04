import React from "react";
import { observer } from "mobx-react-lite";

import CorrespondenceDependenciesTable from "./Cards/Dependencies";

function CorrespondenceDetailDependsOnView() {
  return (
    <>
      <CorrespondenceDependenciesTable />
    </>
  );
}

export default observer(CorrespondenceDetailDependsOnView);

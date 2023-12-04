import React from "react";
import { observer } from "mobx-react-lite";

import DocumentDependenciesTable from "./Cards/Dependencies";

function CorrespondenceDetailDependsToView() {
  return (
    <>
      <DocumentDependenciesTable />
    </>
  );
}

export default observer(CorrespondenceDetailDependsToView);

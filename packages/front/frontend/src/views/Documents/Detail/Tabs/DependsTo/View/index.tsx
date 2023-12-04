import React from "react";
import { observer } from "mobx-react-lite";

import DocumentDependenciesTable from "./Cards/Dependencies";

function DocumentDetailDependsToView() {
  return (
    <>
      <DocumentDependenciesTable />
    </>
  );
}

export default observer(DocumentDetailDependsToView);

import React from "react";
import { observer } from "mobx-react-lite";

import DocumentDependenciesTable from "./Cards/Dependencies";

function DocumentDetailDependsOnView() {
  return (
    <>
      <DocumentDependenciesTable />
    </>
  );
}

export default observer(DocumentDetailDependsOnView);

import React from "react";
import { observer } from "mobx-react-lite";

import AdditionalActions from "components/AdditionalActions";

import DeleteDocumentRevisionAction from "./Delete";
import ActiveDocumentRevisionAction from "./Active";
import ArchiveDocumentRevisionAction from "./Archive";

function DocumentRevisionAdditionalActions() {
  const [deleteOpened, setDeleteOpened] = React.useState(false);

  return (
    <AdditionalActions closeOnClickOutside={!deleteOpened}>
      <ActiveDocumentRevisionAction />
      <ArchiveDocumentRevisionAction />
      <DeleteDocumentRevisionAction onOpenedChange={setDeleteOpened} />
    </AdditionalActions>
  );
}

export default observer(DocumentRevisionAdditionalActions);

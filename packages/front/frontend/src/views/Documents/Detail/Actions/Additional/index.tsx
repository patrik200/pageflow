import React from "react";
import { observer } from "mobx-react-lite";

import AdditionalActions from "components/AdditionalActions";

import { DocumentEntity } from "core/entities/document/document";

import MoveDocumentAction from "./Move";
import DeleteDocumentAction from "./Delete";
import ActiveDocumentAction from "./Active";
import ArchiveDocumentAction from "./Archive";

interface DocumentAdditionalActionsInterface {
  document: DocumentEntity;
}

function DocumentAdditionalActions({ document }: DocumentAdditionalActionsInterface) {
  const [deleteOpened, setDeleteOpened] = React.useState(false);
  const [moveOpened, setMoveOpened] = React.useState(false);

  return (
    <AdditionalActions closeOnClickOutside={!deleteOpened && !moveOpened}>
      <ActiveDocumentAction document={document} />
      <ArchiveDocumentAction document={document} />
      <MoveDocumentAction document={document} onOpenedChange={setMoveOpened} />
      <DeleteDocumentAction document={document} onOpenedChange={setDeleteOpened} />
    </AdditionalActions>
  );
}

export default observer(DocumentAdditionalActions);

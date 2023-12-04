import React from "react";
import { observer } from "mobx-react-lite";

import { DocumentRevisionFilterEntity } from "core/storages/document/entities/revision/DocumentRevisionFilter";

import DocumentRevisionsCreateAction from "./Create";
import DocumentRevisionsShowArchivedAction from "./ShowArchived";

import { wrapperStyles } from "./style.css";

interface DocumentRevisionsActionsInterface {
  filter: DocumentRevisionFilterEntity;
}

function DocumentRevisionsActions({ filter }: DocumentRevisionsActionsInterface) {
  return (
    <div className={wrapperStyles}>
      <DocumentRevisionsShowArchivedAction filter={filter} />
      <DocumentRevisionsCreateAction />
    </div>
  );
}

export default observer(DocumentRevisionsActions);

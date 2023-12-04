import React from "react";
import { observer } from "mobx-react-lite";

import { DocumentEntity } from "core/entities/document/document";

import DocumentEditAction from "./Edit";
import DocumentAdditionalAction from "./Additional";
import DocumentFavouriteAction from "./Favourite";

interface DocumentActionsInterface {
  document: DocumentEntity;
}

function DocumentActions({ document }: DocumentActionsInterface) {
  return (
    <>
      <DocumentEditAction document={document} />
      <div>
        <DocumentFavouriteAction document={document} />
        <DocumentAdditionalAction document={document} />
      </div>
    </>
  );
}

export default observer(DocumentActions);

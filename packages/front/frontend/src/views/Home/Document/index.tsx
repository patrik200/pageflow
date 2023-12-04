import React from "react";
import { observer } from "mobx-react-lite";

import { DocumentEntity } from "core/entities/document/document";

import HomeTableRowTemplate from "../TableRowTemplate";

interface HomeDocumentInterface {
  document: DocumentEntity;
}

function HomeDocument({ document }: HomeDocumentInterface) {
  return <HomeTableRowTemplate title={document.name} href={`/documents/${document.id}`} />;
}

export default observer(HomeDocument);

import React from "react";
import { observer } from "mobx-react-lite";

import { DocumentRevisionEntity } from "core/entities/documentRevision/revision";

import HomeTableRowTemplate from "../TableRowTemplate";

interface HomeDocumentRevisionInterface {
  revision: DocumentRevisionEntity;
}

function HomeDocumentRevision({ revision }: HomeDocumentRevisionInterface) {
  return <HomeTableRowTemplate title={revision.number} href={`/document-revisions/${revision.id}`} />;
}

export default observer(HomeDocumentRevision);

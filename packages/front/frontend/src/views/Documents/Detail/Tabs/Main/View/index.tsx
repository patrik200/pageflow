import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import Card from "components/Card";

import { DocumentStorage } from "core/storages/document";

import DocumentInfoCard from "./Cards/DocumentInfo";
import DocumentRevisionsCard from "./Cards/DocumentRevisions";
import ChangeFeedEvents from "./Cards/ChangeFeedEvents";

import { wrapperStyles } from "./style.css";

function DocumentDetailMainView() {
  const { documentDetail } = useViewContext().containerInstance.get(DocumentStorage);
  return (
    <div className={wrapperStyles}>
      <DocumentInfoCard />
      <DocumentRevisionsCard />
      <Card>
        {documentDetail!.changeFeedEvents.map((event, key) => (
          <ChangeFeedEvents key={key} event={event} />
        ))}
      </Card>
    </div>
  );
}

export default observer(DocumentDetailMainView);

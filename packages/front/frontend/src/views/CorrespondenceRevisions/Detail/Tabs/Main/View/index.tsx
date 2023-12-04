import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import Card from "components/Card";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

import InfoCard from "./Cards/Info";
import CommentsCard from "./Cards/Comments";
import ChangeFeedEvents from "./Cards/ChangeFeedEvents";

import { wrapperStyles } from "./style.css";

function RevisionDetailMainView() {
  const { revisionDetail } = useViewContext().containerInstance.get(CorrespondenceRevisionsStorage);

  return (
    <div className={wrapperStyles}>
      <InfoCard />
      <CommentsCard />
      <Card>
        {revisionDetail!.changeFeedEvents.map((event, key) => (
          <ChangeFeedEvents key={key} event={event} />
        ))}
      </Card>
    </div>
  );
}

export default observer(RevisionDetailMainView);

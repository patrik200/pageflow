import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import Card from "components/Card";

import { CorrespondenceStorage } from "core/storages/correspondence";

import CorrespondenceInfoCard from "./Cards/CorrespondenceInfo";
import CorrespondenceRevisionsCard from "./Cards/CorrespondenceRevisions";
import ChangeFeedEvents from "./Cards/ChangeFeedEvents";

import { wrapperStyles } from "./style.css";

function CorrespondenceDetailMainView() {
  const { correspondenceDetail } = useViewContext().containerInstance.get(CorrespondenceStorage);
  return (
    <div className={wrapperStyles}>
      <CorrespondenceInfoCard />
      <CorrespondenceRevisionsCard />
      <Card>
        {correspondenceDetail!.changeFeedEvents.map((event, key) => (
          <ChangeFeedEvents key={key} event={event} />
        ))}
      </Card>
    </div>
  );
}

export default observer(CorrespondenceDetailMainView);

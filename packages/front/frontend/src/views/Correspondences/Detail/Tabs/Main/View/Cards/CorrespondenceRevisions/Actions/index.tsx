import React from "react";
import { observer } from "mobx-react-lite";

import { CorrespondenceRevisionFilterEntity } from "core/storages/correspondence/entities/revision/CorrespondenceRevisionFilter";

import CorrespondenceRevisionsShowArchivedAction from "./ShowArchived";
import CreateAction from "./Create";

import { wrapperStyles } from "./style.css";

interface CorrespondenceRevisionsActionsInterface {
  filter: CorrespondenceRevisionFilterEntity;
}

function CorrespondenceRevisionsActions({ filter }: CorrespondenceRevisionsActionsInterface) {
  return (
    <div className={wrapperStyles}>
      <CorrespondenceRevisionsShowArchivedAction filter={filter} />
      <CreateAction />
    </div>
  );
}

export default observer(CorrespondenceRevisionsActions);

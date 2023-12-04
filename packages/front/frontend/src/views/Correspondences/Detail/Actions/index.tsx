import React from "react";
import { observer } from "mobx-react-lite";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import CorrespondenceEditAction from "./Edit";
import CorrespondenceAdditionalActions from "./Additional";
import CorrespondenceFavouriteAction from "./Favourite";

interface CorrespondenceActionsInterface {
  correspondence: CorrespondenceEntity;
}

function CorrespondenceActions({ correspondence }: CorrespondenceActionsInterface) {
  return (
    <>
      <CorrespondenceEditAction correspondence={correspondence} />
      <div>
        <CorrespondenceFavouriteAction correspondence={correspondence} />
        <CorrespondenceAdditionalActions correspondence={correspondence} />
      </div>
    </>
  );
}

export default observer(CorrespondenceActions);

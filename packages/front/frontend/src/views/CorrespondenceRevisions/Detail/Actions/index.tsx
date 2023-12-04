import React from "react";
import { observer } from "mobx-react-lite";

import EditAction from "./Edit";
import AdditionalActions from "./Additional";
import CorrespondenceRevisionFavouriteAction from "./Favourite";

function RevisionActions() {
  return (
    <>
      <EditAction />
      <div>
        <CorrespondenceRevisionFavouriteAction />
        <AdditionalActions />
      </div>
    </>
  );
}

export default observer(RevisionActions);

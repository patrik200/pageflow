import React from "react";
import { observer } from "mobx-react-lite";

import EditAction from "./Edit";
import AdditionalActions from "./Additional";
import DocumentRevisionFavouriteAction from "./Favourite";
import DocumentRevisionApprovingStatesAction from "./ApprovingStates";
import DocumentRevisionProlongApprovingDateAction from "./ProlongApprovingDate";

function RevisionActions() {
  return (
    <>
      <DocumentRevisionProlongApprovingDateAction />
      <DocumentRevisionApprovingStatesAction />
      <EditAction />
      <div>
        <DocumentRevisionFavouriteAction />
        <AdditionalActions />
      </div>
    </>
  );
}

export default observer(RevisionActions);

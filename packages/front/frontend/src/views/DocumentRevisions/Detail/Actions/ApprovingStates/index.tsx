import React from "react";
import { observer } from "mobx-react-lite";

import DocumentRevisionMoveToApprovedActionByResponsibleUserFlow from "./MoveToApprovedByResponsibleUserFlow";
import DocumentRevisionMoveToApprovedActionByResponsibleUser from "./MoveToApprovedByResponsibleUser";
import DocumentRevisionMoveToInitialForCancelReviewAction from "./MoveToInitialForCancelReview";
import DocumentRevisionMoveToInitialForRestoreFromRevokedAction from "./MoveToInitialForRestoreFromRevoked";
import DocumentRevisionMoveToReturnAction from "./MoveToReturn";
import DocumentRevisionMoveToReviewAction from "./MoveToReview";
import DocumentRevisionMoveToRevokedAction from "./MoveToRevoked";

function DocumentRevisionApprovingStatesAction() {
  return (
    <>
      <DocumentRevisionMoveToApprovedActionByResponsibleUserFlow />
      <DocumentRevisionMoveToApprovedActionByResponsibleUser />
      <DocumentRevisionMoveToInitialForCancelReviewAction />
      <DocumentRevisionMoveToInitialForRestoreFromRevokedAction />
      <DocumentRevisionMoveToReturnAction />
      <DocumentRevisionMoveToReviewAction />
      <DocumentRevisionMoveToRevokedAction />
    </>
  );
}

export default observer(DocumentRevisionApprovingStatesAction);

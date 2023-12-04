import React from "react";
import { observer } from "mobx-react-lite";
import { Icon } from "@app/ui-kit";

import { DocumentRevisionResponsibleUserFlowRowUserEntity } from "core/entities/documentRevision/revisionDetail";

import InfoCardUserFlowRowUserActionApprove from "./Approve";

import { approvedIconStyles } from "./style.css";

interface InfoCardUserFlowRowUserActionsInterface {
  entity: DocumentRevisionResponsibleUserFlowRowUserEntity;
  approveActionDisabled: boolean;
  rowIndex: number;
  userIndex: number;
}

function InfoCardUserFlowRowUserActions({
  entity,
  approveActionDisabled,
  rowIndex,
  userIndex,
}: InfoCardUserFlowRowUserActionsInterface) {
  return (
    <>
      {entity.approved && <Icon className={approvedIconStyles} icon="checkboxCircleFill" />}
      {!approveActionDisabled && (
        <InfoCardUserFlowRowUserActionApprove rowUser={entity} rowIndex={rowIndex} userIndex={userIndex} />
      )}
    </>
  );
}

export default observer(InfoCardUserFlowRowUserActions);

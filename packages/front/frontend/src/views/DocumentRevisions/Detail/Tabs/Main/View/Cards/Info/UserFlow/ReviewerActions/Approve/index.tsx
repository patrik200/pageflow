import React from "react";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button, Icon } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";
import { observer } from "mobx-react-lite";
import { DocumentRevisionStatus } from "@app/shared-enums";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

import MoveToReviewerApprovedStatusModal from "./Modal";

import { approvedIconStyles } from "./style.css";

function InfoCardUserFlowReviewerActionApprove() {
  const { t } = useTranslation("document-revision-detail");
  const { revisionDetail } = useViewContext().containerInstance.get(DocumentRevisionsStorage);
  const [opened, open, close] = useBoolean(false);

  return (
    <>
      {revisionDetail!.canMoveToApprovedStatusByResponsibleUserFlowReviewer && (
        <Button size="SMALL" onClick={open}>
          {t({ scope: "user_flow", place: "reviewer", name: "action" })}
        </Button>
      )}
      {revisionDetail!.status === DocumentRevisionStatus.APPROVED && (
        <Icon className={approvedIconStyles} icon="checkboxCircleFill" />
      )}
      <MoveToReviewerApprovedStatusModal opened={opened} onClose={close} />
    </>
  );
}

export default observer(InfoCardUserFlowReviewerActionApprove);

import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Icon, PopupManagerMode, Tooltip, Typography } from "@app/ui-kit";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentStorage } from "core/storages/document";

import { hasUnresolvedCommentTooltipTextStyles, iconStyles } from "./style.css";

function DocumentRevisionMoveToApprovedActionByResponsibleUserFlow() {
  const { t } = useTranslation("document-revision-detail");

  const { containerInstance } = useViewContext();

  const { revisionDetail } = containerInstance.get(DocumentRevisionsStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);

  if (!documentDetail?.resultCanEdit) return null;

  if (revisionDetail!.moveToApprovedStatusByResponsibleUserFlowStoppedByUnresolvedComment) {
    return (
      <Tooltip
        mode={PopupManagerMode.HOVER}
        primaryPlacement="bottom"
        offset={8}
        popupElement={
          <Typography className={hasUnresolvedCommentTooltipTextStyles}>
            {t({
              scope: "view_revision",
              place: "action_statuses",
              name: "move_to_approved_by_responsible_user_flow",
              parameter: "has_unresolved_comments_tooltip",
            })}
          </Typography>
        }
        triggerElement={<Icon icon="informationLine" className={iconStyles} />}
      />
    );
  }

  if (revisionDetail!.moveToApprovedStatusByResponsibleUserFlowStoppedByNotApproved) {
    return (
      <Tooltip
        mode={PopupManagerMode.HOVER}
        primaryPlacement="bottom"
        offset={8}
        popupElement={
          <Typography className={hasUnresolvedCommentTooltipTextStyles}>
            {t({
              scope: "view_revision",
              place: "action_statuses",
              name: "move_to_approved_by_responsible_user_flow",
              parameter: "not_approved_tooltip",
            })}
          </Typography>
        }
        triggerElement={<Icon icon="informationLine" className={iconStyles} />}
      />
    );
  }

  return null;
}

export default observer(DocumentRevisionMoveToApprovedActionByResponsibleUserFlow);

import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button, PopupManagerMode, Tooltip, Typography } from "@app/ui-kit";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentStorage } from "core/storages/document";

import MoveToApprovedActionByResponsibleUserButton from "./Action";

import { buttonStyles, hasUnresolvedCommentTooltipTextStyles } from "./style.css";

function DocumentRevisionMoveToApprovedActionByResponsibleUser() {
  const { t } = useTranslation("document-revision-detail");

  const { containerInstance } = useViewContext();

  const { revisionDetail } = containerInstance.get(DocumentRevisionsStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);

  if (!documentDetail?.resultCanEdit) return null;

  if (revisionDetail!.moveToApprovedStatusByResponsibleUserStoppedByUnresolvedComment) {
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
              name: "move_to_approved_by_responsible_user",
              parameter: "has_unresolved_comments_tooltip",
            })}
          </Typography>
        }
        triggerElement={
          <div>
            <Button className={buttonStyles} disabled size="SMALL">
              {t({
                scope: "view_revision",
                place: "action_statuses",
                name: "move_to_approved_by_responsible_user",
                parameter: "button",
              })}
            </Button>
          </div>
        }
      />
    );
  }

  if (!revisionDetail!.canMoveToApprovedStatusByResponsibleUser) return null;

  return <MoveToApprovedActionByResponsibleUserButton />;
}

export default observer(DocumentRevisionMoveToApprovedActionByResponsibleUser);

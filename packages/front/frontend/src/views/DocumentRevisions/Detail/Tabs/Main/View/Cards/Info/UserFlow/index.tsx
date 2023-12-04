import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import UserFlowView, { UserFlowViewRowEntityInterface } from "components/UserFlowView";
import { UserFlowViewRowUserEntityInterface } from "components/UserFlowView/Row/User";

import { DocumentRevisionResponsibleUserFlowEntity } from "core/entities/documentRevision/revisionDetail";

import InfoCardUserFlowRowUserActions from "./UserActions";
import InfoCardUserFlowReviewerActions from "./ReviewerActions";

interface InfoCardUserFlowInterface {
  entity: DocumentRevisionResponsibleUserFlowEntity;
}

function InfoCardUserFlow({ entity }: InfoCardUserFlowInterface) {
  const { t } = useTranslation("document-revision-detail");

  const rows = React.useMemo<UserFlowViewRowEntityInterface[]>(
    () =>
      entity.rows.map(
        (row, rowIndex): UserFlowViewRowEntityInterface => ({
          name: row.name,
          mode: row.mode,
          completed: entity.allRowsCompleted || row.completed,
          progress: row.progress,
          users: row.users.map(
            (rowUser, userIndex): UserFlowViewRowUserEntityInterface & { actions: React.JSX.Element } => ({
              description: rowUser.description,
              user: rowUser.user,
              result: rowUser.result,
              approved: rowUser.approved,
              files: rowUser.files,
              actions: (
                <InfoCardUserFlowRowUserActions
                  entity={rowUser}
                  rowIndex={rowIndex}
                  userIndex={userIndex}
                  approveActionDisabled={row.completed}
                />
              ),
            }),
          ),
        }),
      ),
    [entity.allRowsCompleted, entity.rows],
  );

  return (
    <UserFlowView
      name={entity.name}
      deadlineDaysIncludeWeekends={entity.deadlineDaysIncludeWeekends ?? false}
      deadlineDate={entity.deadlineDate ?? undefined}
      approvedDate={entity.approvedDate ?? undefined}
      rows={rows}
      progress={entity.progress}
      reviewer={entity.reviewer?.user}
      reviewerActions={entity.showReviewerActions && <InfoCardUserFlowReviewerActions />}
      reviewerPlaceholder={t({ scope: "user_flow", place: "reviewer", name: "placeholder" })}
    />
  );
}

export default observer(InfoCardUserFlow);

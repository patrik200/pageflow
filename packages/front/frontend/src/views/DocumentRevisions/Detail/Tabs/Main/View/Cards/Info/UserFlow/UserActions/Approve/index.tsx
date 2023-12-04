import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";

import ApproveUserFlowRowUserModal from "views/DocumentRevisions/Modals/Approve";

import { DocumentRevisionResponsibleUserFlowRowUserEntity } from "core/entities/documentRevision/revisionDetail";
import { ApproveUserFlowRowUserEntity } from "core/storages/document/entities/revision/ApproveUserFlowRowUser";

interface InfoCardUserFlowRowUserActionApproveInterface {
  rowUser: DocumentRevisionResponsibleUserFlowRowUserEntity;
  rowIndex: number;
  userIndex: number;
}

function InfoCardUserFlowRowUserActionApprove({
  rowUser,
  rowIndex,
  userIndex,
}: InfoCardUserFlowRowUserActionApproveInterface) {
  const { t } = useTranslation("document-revision-detail");

  const entity = React.useMemo(() => ApproveUserFlowRowUserEntity.buildForRowUser(rowUser.id), [rowUser]);

  const [approveOpened, openApprove, closeApprove] = useBoolean(false);

  if (!rowUser.canApprove) return null;

  return (
    <>
      <Button size="SMALL" onClick={openApprove}>
        {t({ scope: "user_flow", place: "row_user_actions", name: "approve" })}
      </Button>
      <ApproveUserFlowRowUserModal
        opened={approveOpened}
        entity={entity}
        rowIndex={rowIndex}
        userIndex={userIndex}
        close={closeApprove}
      />
    </>
  );
}

export default observer(InfoCardUserFlowRowUserActionApprove);

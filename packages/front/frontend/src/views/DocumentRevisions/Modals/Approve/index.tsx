import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { ApproveUserFlowRowUserEntity } from "core/storages/document/entities/revision/ApproveUserFlowRowUser";

interface ApproveUserFlowRowUserModalInterface {
  entity: ApproveUserFlowRowUserEntity;
  rowIndex: number;
  userIndex: number;
  opened: boolean;
  close: () => void;
}

const ModalContent = () => import("./ModalContent");

function ApproveUserFlowRowUserModal({
  entity,
  rowIndex,
  userIndex,
  opened,
  close,
}: ApproveUserFlowRowUserModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent
        asyncComponent={ModalContent}
        entity={entity}
        rowIndex={rowIndex}
        userIndex={userIndex}
        onClose={close}
      />
    </Modal>
  );
}

export default observer(ApproveUserFlowRowUserModal);

import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { UserFlowEntity } from "core/entities/userFlow/userFlow";

interface DeleteUserFlowModalInterface {
  userFlow: UserFlowEntity;
  opened: boolean;
  close: () => void;
}

const ModalContent = () => import("./ModalContent");

function DeleteUserFlowModal({ opened, userFlow, close }: DeleteUserFlowModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} userFlow={userFlow} close={close} />
    </Modal>
  );
}

export default observer(DeleteUserFlowModal);

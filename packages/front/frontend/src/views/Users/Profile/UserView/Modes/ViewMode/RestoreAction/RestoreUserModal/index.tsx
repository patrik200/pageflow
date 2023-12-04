import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

interface RestoreUserModalInterface {
  opened: boolean;
  close: () => void;
}

const ModalContent = () => import("./ModalContent");

function RestoreUserModal({ opened, close }: RestoreUserModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} close={close} />
    </Modal>
  );
}

export default observer(RestoreUserModal);

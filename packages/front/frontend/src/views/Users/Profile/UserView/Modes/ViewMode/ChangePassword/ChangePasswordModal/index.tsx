import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

interface ChangePasswordModalInterface {
  opened: boolean;
  close: () => void;
}

const ModalContent = () => import("./ModalContent");

function ChangePasswordModal({ opened, close }: ChangePasswordModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} close={close} />
    </Modal>
  );
}

export default observer(ChangePasswordModal);

import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

interface MoveToReturnModalInterface {
  opened: boolean;
  onClose: () => void;
}

const ModalContent = () => import("./ModalContent");

function CreateInvitationModal({ opened, onClose }: MoveToReturnModalInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent asyncComponent={ModalContent} close={onClose} />
    </Modal>
  );
}

export default observer(CreateInvitationModal);

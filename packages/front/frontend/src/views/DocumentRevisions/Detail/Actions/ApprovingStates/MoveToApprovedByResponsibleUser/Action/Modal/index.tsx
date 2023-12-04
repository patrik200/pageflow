import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

interface MoveToApprovedStatusModalInterface {
  opened: boolean;
  onClose: () => void;
}

const ModalContent = () => import("./ModalContent");

function MoveToApprovedStatusModal({ opened, onClose }: MoveToApprovedStatusModalInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent asyncComponent={ModalContent} onClose={onClose} />
    </Modal>
  );
}

export default observer(MoveToApprovedStatusModal);

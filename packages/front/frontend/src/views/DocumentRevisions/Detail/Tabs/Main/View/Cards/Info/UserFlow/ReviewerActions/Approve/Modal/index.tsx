import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

interface MoveToReviewerApprovedStatusModalInterface {
  opened: boolean;
  onClose: () => void;
}

const ModalContent = () => import("./ModalContent");

function MoveToReviewerApprovedStatusModal({ opened, onClose }: MoveToReviewerApprovedStatusModalInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent asyncComponent={ModalContent} onClose={onClose} />
    </Modal>
  );
}

export default observer(MoveToReviewerApprovedStatusModal);

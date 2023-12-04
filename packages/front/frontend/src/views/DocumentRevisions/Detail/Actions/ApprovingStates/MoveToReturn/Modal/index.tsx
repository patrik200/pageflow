import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

interface MoveToReturnModalInterface {
  opened: boolean;
  onClose: () => void;
}
const ModalContent = () => import("./ModalContent");

function MoveToReturnModal({ opened, onClose }: MoveToReturnModalInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent asyncComponent={ModalContent} onClose={onClose} />
    </Modal>
  );
}

export default observer(MoveToReturnModal);

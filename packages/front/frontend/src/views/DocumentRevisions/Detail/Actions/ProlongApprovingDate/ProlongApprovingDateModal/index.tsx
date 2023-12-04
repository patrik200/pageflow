import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

interface DocumentRevisionProlongApprovingDateModalInterface {
  opened: boolean;
  close: () => void;
}

const ModalContent = () => import("./ModalContent");

function DocumentRevisionProlongApprovingDateModal({
  opened,
  close,
}: DocumentRevisionProlongApprovingDateModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} close={close} />
    </Modal>
  );
}

export default observer(DocumentRevisionProlongApprovingDateModal);

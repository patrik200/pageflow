import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

interface CreateDocumentCorrespondenceDependencyInterface {
  opened: boolean;
  onClose: () => void;
}

const ModalContent = () => import("./ModalContent");

function CreateDocumentCorrespondenceDependencyModal({
  opened,
  onClose,
}: CreateDocumentCorrespondenceDependencyInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent asyncComponent={ModalContent} onClose={onClose} />
    </Modal>
  );
}

export default observer(CreateDocumentCorrespondenceDependencyModal);

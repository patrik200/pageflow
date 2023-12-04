import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { DocumentEntity } from "core/entities/document/document";

interface DeleteDocumentModalInterface {
  document: DocumentEntity;
  opened: boolean;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function DeleteDocumentModal({ opened, document, close, onSuccess }: DeleteDocumentModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} document={document} close={close} onSuccess={onSuccess} />
    </Modal>
  );
}

export default observer(DeleteDocumentModal);

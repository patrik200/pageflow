import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { DocumentRevisionEntity } from "core/entities/documentRevision/revision";

interface DeleteDocumentRevisionModalInterface {
  revision: DocumentRevisionEntity;
  opened: boolean;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function DeleteDocumentRevisionModal({ opened, revision, close, onSuccess }: DeleteDocumentRevisionModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} revision={revision} close={close} onSuccess={onSuccess} />
    </Modal>
  );
}

export default observer(DeleteDocumentRevisionModal);

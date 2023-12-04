import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { DocumentEntity } from "core/entities/document/document";
import { DocumentFilterEntity } from "core/storages/document/entities/document/DocumentFilter";

interface MoveDocumentModalInterface {
  opened: boolean;
  document: DocumentEntity;
  initialFilter: DocumentFilterEntity;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function MoveDocumentModal({ opened, document, initialFilter, close, onSuccess }: MoveDocumentModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent
        asyncComponent={ModalContent}
        document={document}
        initialFilter={initialFilter}
        close={close}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}

export default observer(MoveDocumentModal);

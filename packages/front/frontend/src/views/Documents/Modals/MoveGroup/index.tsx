import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { DocumentGroupEntity } from "core/entities/document/group";
import { DocumentFilterEntity } from "core/storages/document/entities/document/DocumentFilter";

interface MoveDocumentGroupModalInterface {
  opened: boolean;
  group: DocumentGroupEntity;
  initialFilter: DocumentFilterEntity;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function MoveDocumentGroupModal({ opened, group, initialFilter, close, onSuccess }: MoveDocumentGroupModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent
        asyncComponent={ModalContent}
        group={group}
        initialFilter={initialFilter}
        close={close}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}

export default observer(MoveDocumentGroupModal);

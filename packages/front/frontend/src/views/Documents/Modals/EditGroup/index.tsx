import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { DocumentGroupEntity } from "core/entities/document/group";

interface EditDocumentGroupModalInterface {
  opened: boolean;
  group?: DocumentGroupEntity;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function EditDocumentGroupModal({ opened, group, close, onSuccess }: EditDocumentGroupModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} group={group} close={close} onSuccess={onSuccess} />
    </Modal>
  );
}

export default observer(EditDocumentGroupModal);

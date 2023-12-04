import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { DocumentGroupEntity } from "core/entities/document/group";

interface DocumentGroupPermissionsModalInterface {
  entity: DocumentGroupEntity;
  opened: boolean;
  close: () => void;
}

const ModalContent = () => import("./ModalContent");

function DocumentGroupPermissionsModal({ entity, opened, close }: DocumentGroupPermissionsModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} group={entity} />
    </Modal>
  );
}

export default observer(DocumentGroupPermissionsModal);

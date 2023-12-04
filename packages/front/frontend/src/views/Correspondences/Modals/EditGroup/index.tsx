import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

interface EditCorrespondenceGroupModalInterface {
  opened: boolean;
  group?: CorrespondenceGroupEntity;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function EditCorrespondenceGroupModal({ opened, group, close, onSuccess }: EditCorrespondenceGroupModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} group={group} close={close} onSuccess={onSuccess} />
    </Modal>
  );
}

export default observer(EditCorrespondenceGroupModal);

import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

interface DeleteCorrespondenceGroupModalInterface {
  opened: boolean;
  group: CorrespondenceGroupEntity;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function DeleteCorrespondenceGroupModal({ opened, group, close, onSuccess }: DeleteCorrespondenceGroupModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} group={group} close={close} onSuccess={onSuccess} />
    </Modal>
  );
}

export default observer(DeleteCorrespondenceGroupModal);

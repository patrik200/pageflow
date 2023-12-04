import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

interface DeleteCorrespondenceModalInterface {
  correspondence: CorrespondenceEntity;
  opened: boolean;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function DeleteCorrespondenceModal({ opened, correspondence, close, onSuccess }: DeleteCorrespondenceModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent
        asyncComponent={ModalContent}
        correspondence={correspondence}
        close={close}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}

export default observer(DeleteCorrespondenceModal);

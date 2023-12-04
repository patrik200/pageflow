import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { CorrespondenceRevisionEntity } from "core/entities/correspondenceRevision/revision";

interface DeleteCorrespondenceRevisionModalInterface {
  revision: CorrespondenceRevisionEntity;
  opened: boolean;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function DeleteCorrespondenceRevisionModal({
  opened,
  revision,
  close,
  onSuccess,
}: DeleteCorrespondenceRevisionModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} revision={revision} close={close} onSuccess={onSuccess} />
    </Modal>
  );
}

export default observer(DeleteCorrespondenceRevisionModal);

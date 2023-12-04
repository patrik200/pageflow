import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";
import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

interface MoveCorrespondenceModalInterface {
  opened: boolean;
  correspondence: CorrespondenceEntity;
  initialFilter: CorrespondenceFilterEntity;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function MoveCorrespondenceModal({
  opened,
  correspondence,
  initialFilter,
  close,
  onSuccess,
}: MoveCorrespondenceModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent
        asyncComponent={ModalContent}
        correspondence={correspondence}
        initialFilter={initialFilter}
        close={close}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}

export default observer(MoveCorrespondenceModal);

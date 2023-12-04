import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";
import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

interface MoveCorrespondenceGroupModalInterface {
  opened: boolean;
  group: CorrespondenceGroupEntity;
  initialFilter: CorrespondenceFilterEntity;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function MoveCorrespondenceGroupModal({
  opened,
  group,
  initialFilter,
  close,
  onSuccess,
}: MoveCorrespondenceGroupModalInterface) {
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

export default observer(MoveCorrespondenceGroupModal);

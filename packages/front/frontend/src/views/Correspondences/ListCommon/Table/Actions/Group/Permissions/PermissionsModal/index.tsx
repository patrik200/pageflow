import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

interface CorrespondenceGroupPermissionsModalInterface {
  entity: CorrespondenceGroupEntity;
  opened: boolean;
  onClose: () => void;
}

const ModalContent = () => import("./ModalContent");

function CorrespondenceGroupPermissionsModal({
  entity,
  opened,
  onClose,
}: CorrespondenceGroupPermissionsModalInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent asyncComponent={ModalContent} group={entity} />
    </Modal>
  );
}

export default observer(CorrespondenceGroupPermissionsModal);

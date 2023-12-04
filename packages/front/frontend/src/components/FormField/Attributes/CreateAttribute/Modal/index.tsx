import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";
import { AttributeCategory } from "@app/shared-enums";

import AsyncModalContent from "components/AsyncModalContent";

import { AttributeInEntityEntity } from "core/entities/attributes/attribute-in-entity";

interface CreateAttributeModalInterface {
  onlyAppending: boolean;
  category: AttributeCategory;
  opened: boolean;
  onClose: () => void;
  onCreate: (attribute: AttributeInEntityEntity) => void;
}

const ModalContent = () => import("./ModalContent");

function CreateAttributeModal({ onlyAppending, opened, category, onCreate, onClose }: CreateAttributeModalInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent
        asyncComponent={ModalContent}
        onlyAppending={onlyAppending}
        category={category}
        onClose={onClose}
        onCreate={onCreate}
      />
    </Modal>
  );
}

export default observer(CreateAttributeModal);

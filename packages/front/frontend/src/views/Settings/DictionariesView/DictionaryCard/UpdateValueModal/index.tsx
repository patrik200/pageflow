import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { DictionaryEntity, DictionaryValueEntity } from "core/entities/dictionary/dictionary";

interface UpdateDictionaryValueModalInterface {
  opened: boolean;
  dictionary: DictionaryEntity;
  value?: DictionaryValueEntity;
  close: () => void;
}

const ModalContent = () => import("./ModalContent");

function UpdateDictionaryValueModal({ dictionary, value, opened, close }: UpdateDictionaryValueModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} value={value} dictionary={dictionary} close={close} />
    </Modal>
  );
}

export default observer(UpdateDictionaryValueModal);

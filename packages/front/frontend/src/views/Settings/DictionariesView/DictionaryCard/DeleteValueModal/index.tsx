import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { DictionaryEntity, DictionaryValueEntity } from "core/entities/dictionary/dictionary";

interface DeleteDictionaryValueModalInterface {
  opened: boolean;
  dictionary: DictionaryEntity;
  value: DictionaryValueEntity;
  close: () => void;
}

const ModalContent = () => import("./ModalContent");

function DeleteDictionaryValueModal({ dictionary, value, opened, close }: DeleteDictionaryValueModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} value={value} dictionary={dictionary} close={close} />
    </Modal>
  );
}

export default observer(DeleteDictionaryValueModal);

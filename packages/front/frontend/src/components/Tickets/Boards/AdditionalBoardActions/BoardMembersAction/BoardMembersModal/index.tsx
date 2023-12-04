import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

interface BoardMembersModalInterface {
  boardId: string;
  opened: boolean;
  onClose: () => void;
}

const ModalContent = () => import("./ModalContent");

function BoardMembersModal({ opened, boardId, onClose }: BoardMembersModalInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent asyncComponent={ModalContent} boardId={boardId} />
    </Modal>
  );
}

export default observer(BoardMembersModal);

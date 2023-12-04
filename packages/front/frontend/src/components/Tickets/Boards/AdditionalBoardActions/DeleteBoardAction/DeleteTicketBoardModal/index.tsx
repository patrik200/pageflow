import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

interface DeleteTicketBoardModalInterface {
  boardId: string;
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function DeleteTicketBoardModal({ opened, boardId, onClose, onSuccess }: DeleteTicketBoardModalInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent asyncComponent={ModalContent} boardId={boardId} onClose={onClose} onSuccess={onSuccess} />
    </Modal>
  );
}

export default observer(DeleteTicketBoardModal);

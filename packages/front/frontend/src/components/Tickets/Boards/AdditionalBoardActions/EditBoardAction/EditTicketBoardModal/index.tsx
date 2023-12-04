import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { TicketBoardEntity } from "core/entities/ticket/ticketBoard";

interface EditTicketBoardModalInterface {
  boardId?: string;
  projectId?: string;
  opened: boolean;
  onClose: () => void;
  onSuccess?: (entity: TicketBoardEntity) => void;
}

const ModalContent = () => import("./ModalContent");

function EditTicketBoardModal({ opened, boardId, projectId, onClose, onSuccess }: EditTicketBoardModalInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent
        asyncComponent={ModalContent}
        boardId={boardId}
        projectId={projectId}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}

export default observer(EditTicketBoardModal);

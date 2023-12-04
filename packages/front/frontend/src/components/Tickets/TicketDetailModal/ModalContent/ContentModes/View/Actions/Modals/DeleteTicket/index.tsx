import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

interface DeleteTicketModalInterface {
  ticket: TicketDetailEntity;
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function DeleteTicketModal({ ticket, opened, onClose, onSuccess }: DeleteTicketModalInterface) {
  return (
    <Modal opened={opened} onClose={onClose}>
      <AsyncModalContent asyncComponent={ModalContent} ticket={ticket} onClose={onClose} onSuccess={onSuccess} />
    </Modal>
  );
}

export default observer(DeleteTicketModal);

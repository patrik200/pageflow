import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { modalHeaderStyles } from "./styles.css";

interface TicketDetailModalInterface {
  ticketId: string | null;
  onClose: () => void;
}

const ModalContent = () => import("./ModalContent");

function TicketDetailModal({ ticketId, onClose }: TicketDetailModalInterface) {
  return (
    <Modal
      beforeContent={<div id="ticket-modal-header" className={modalHeaderStyles} />}
      opened={!!ticketId}
      onClose={onClose}
    >
      <AsyncModalContent asyncComponent={ModalContent} ticketId={ticketId} close={onClose} />
    </Modal>
  );
}

export default observer(TicketDetailModal);

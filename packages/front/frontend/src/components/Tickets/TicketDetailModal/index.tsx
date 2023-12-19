import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { modalHeaderStyles } from "./styles.css";

interface TicketDetailModalInterface {
  ticketSlug: string | null;
  onClose: () => void;
}

const ModalContent = () => import("./ModalContent");

function TicketDetailModal({ ticketSlug, onClose }: TicketDetailModalInterface) {
  return (
    <Modal
      beforeContent={<div id="ticket-modal-header" className={modalHeaderStyles} />}
      opened={!!ticketSlug}
      onClose={onClose}
    >
      <AsyncModalContent asyncComponent={ModalContent} ticketSlug={ticketSlug} close={onClose} />
    </Modal>
  );
}

export default observer(TicketDetailModal);

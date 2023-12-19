import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter, useTranslation } from "@app/front-kit";

import ViewTicketCard, {
  ViewTicketCardActions,
} from "components/Tickets/TicketDetailModal/ModalContent/ContentModes/View";
import CardTitlePreset from "components/Card/pressets/CardTitle";
import Card from "components/Card";
import TicketSlug from "components/Tickets/TicketDetailModal/ModalContent/Slug";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

import { slugStyles } from "./style.css";

interface TicketDetailViewInterface {
  ticket: TicketDetailEntity;
  onEnableEditMode: () => void;
}

function TicketDetailView({ ticket, onEnableEditMode }: TicketDetailViewInterface) {
  const { push } = useRouter();
  const { t } = useTranslation("ticket-detail");

  const handleTicketDeleteSuccess = React.useCallback(async () => {
    await push.current("/tickets");
  }, [push]);

  return (
    <>
      <CardTitlePreset
        preTitle={<TicketSlug className={slugStyles} ticket={ticket} />}
        title={t({ scope: "meta", name: "view" }, { name: ticket.name || "" })}
        actions={
          <ViewTicketCardActions
            entity={ticket}
            onTicketEdit={onEnableEditMode}
            onDeleteSuccess={handleTicketDeleteSuccess}
          />
        }
      />
      <Card>
        <ViewTicketCard ticket={ticket} />
      </Card>
    </>
  );
}

export default observer(TicketDetailView);

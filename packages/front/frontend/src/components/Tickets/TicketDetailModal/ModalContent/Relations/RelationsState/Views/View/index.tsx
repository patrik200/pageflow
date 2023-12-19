import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Typography } from "@app/ui-kit";
import React from "react";

import { TicketRelationsStorage } from "core/storages/ticket/relations";
import { TicketsStorage } from "core/storages/ticket";

import TicketRelationRow from "../../Rows/TicketRelationRow";

import { emptyValueStyles, wrapperStyles } from "./style.css";

function ViewRelations() {
  const { t } = useTranslation("ticket-detail");

  const { containerInstance } = useViewContext();
  const { ticketRelations, loadTicketRelations } = containerInstance.get(TicketRelationsStorage);
  const ticketDetail = containerInstance.get(TicketsStorage).ticketDetail!;

  React.useEffect(() => {
    void loadTicketRelations(ticketDetail.id);
  }, [loadTicketRelations, ticketDetail]);

  return (
    <div className={wrapperStyles}>
      {ticketRelations.length === 0 ? (
        <Typography className={emptyValueStyles}>
          {t({ scope: "main_tab", place: "relations_field", name: "empty_value" })}
        </Typography>
      ) : (
        ticketRelations.map((relation) => (
          <TicketRelationRow
            key={relation.id}
            ticketId={ticketDetail.id === relation.mainTicket.id ? relation.relatedTicket.id : relation.mainTicket.id}
            relationType={relation.type}
            isMainTicket={ticketDetail.id === relation.mainTicket.id}
          />
        ))
      )}
    </div>
  );
}

export default observer(ViewRelations);

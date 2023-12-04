import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldUser from "components/FormField/User";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

interface TicketAuthorInterface {
  entity: TicketDetailEntity;
}

function TicketAuthor({ entity }: TicketAuthorInterface) {
  const { t } = useTranslation("ticket-detail");

  return <FormFieldUser title={t({ scope: "main_tab", place: "author_field", name: "title" })} value={entity.author} />;
}

export default observer(TicketAuthor);

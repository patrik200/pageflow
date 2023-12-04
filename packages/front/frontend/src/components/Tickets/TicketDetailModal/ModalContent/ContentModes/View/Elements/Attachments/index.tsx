import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldAttachments from "components/FormField/Attachments";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

interface TicketAttachmentsInterface {
  entity: TicketDetailEntity;
}

function TicketAttachments({ entity }: TicketAttachmentsInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldAttachments
      view
      title={t({ scope: "main_tab", place: "files_field", name: "title" })}
      value={entity.files}
    />
  );
}

export default observer(TicketAttachments);

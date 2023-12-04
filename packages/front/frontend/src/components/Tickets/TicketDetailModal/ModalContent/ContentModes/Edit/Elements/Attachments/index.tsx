import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldAttachments from "components/FormField/Attachments";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

interface TicketAttachmentsInterface {
  entity: EditTicketEntity;
}

function TicketAttachments({ entity }: TicketAttachmentsInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldAttachments
      edit
      onAdd={entity.addFiles}
      onDelete={entity.deleteFilesByIndex}
      title={t({ scope: "main_tab", place: "files_field", name: "title" })}
      value={entity.files}
    />
  );
}

export default observer(TicketAttachments);

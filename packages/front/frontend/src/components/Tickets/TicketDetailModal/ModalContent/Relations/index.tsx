import React from "react";
import { useTranslation } from "@app/front-kit";
import { observer } from "mobx-react-lite";

import FormFieldWrapper from "components/FormField/Wrapper";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import RelationsState from "./RelationsState";

interface RelationsCardInterface {
  edit: boolean;
  ticketEntity?: EditTicketEntity;
}

function RelationsCard({ edit, ticketEntity }: RelationsCardInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldWrapper
      title={t({ scope: "main_tab", place: "relations_field", name: "title" })}
      mode={edit ? "edit" : "view"}
    >
      <RelationsState edit={edit} editTicketEntity={ticketEntity} />
    </FormFieldWrapper>
  );
}

export default observer(RelationsCard);

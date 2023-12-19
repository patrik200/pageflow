import React from "react";
import { observer } from "mobx-react-lite";
import { TicketRelationTypes } from "@app/shared-enums";

import FormFieldSelect from "components/FormField/Select";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import { useTicketRelationTypeSelectOptions } from "../../hooks";
import DeleteTicketRelationAction from "./DeleteAction";
import TicketRelationTicketRow from "./TicketRow";

import { useTicket } from "./hooks";

import { ticketFieldStyles, typeFieldStyles, wrapperStyles } from "./style.css";

type TicketRelationRowInterface = {
  ticketId: string;
  relationType: TicketRelationTypes;
  isMainTicket: boolean;
} & (
  | {}
  | {
      index: number;
      edit: true;
      editTicketEntity: EditTicketEntity;
    }
);

function TicketRelationRow({ ticketId, relationType, isMainTicket, ...props }: TicketRelationRowInterface) {
  const ticketRelationTypesSelectOptions = useTicketRelationTypeSelectOptions(isMainTicket);
  const ticket = useTicket(ticketId);

  if (!ticket) return null;

  return (
    <div className={wrapperStyles}>
      <FormFieldSelect
        className={typeFieldStyles}
        view
        options={ticketRelationTypesSelectOptions}
        value={relationType}
      />
      <TicketRelationTicketRow className={ticketFieldStyles} ticket={ticket} />
      {"edit" in props && props.edit && (
        <DeleteTicketRelationAction index={props.index} ticketEntity={props.editTicketEntity} />
      )}
    </div>
  );
}

export default observer(TicketRelationRow);

import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";

import FormFieldSelect from "components/FormField/Select";

import { EditTicketRelationEntity } from "core/storages/ticket/entities/EditTicketRelation";
import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";
import { LoadTicketsFilterEntity } from "core/storages/ticket/entities/LoadTicketsFilterEntity";

import { TicketsStorage } from "core/storages/ticket";

import { useTicketRelationTypeSelectOptions } from "../../hooks";

import { useTicketSelectOptions } from "./hooks";

import { actionsWrapperStyles, ticketFieldStyles, typeFieldStyles, wrapperStyles } from "./style.css";

interface CreateTicketRelationRowInterface {
  ticketFilterEntity: LoadTicketsFilterEntity;
  ticketEntity: EditTicketEntity;
  onClose: () => void;
}

function CreateTicketRelationRow({ ticketFilterEntity, ticketEntity, onClose }: CreateTicketRelationRowInterface) {
  const { t } = useTranslation("ticket-detail");

  const { ticketDetail } = useViewContext().containerInstance.get(TicketsStorage);
  const entity = React.useMemo(() => EditTicketRelationEntity.buildEmpty(), []);

  const ticketSelectOptions = useTicketSelectOptions(ticketDetail?.id);
  const relationTypesSelectOptions = useTicketRelationTypeSelectOptions(true);

  const handleCreateRelation = React.useCallback(() => {
    ticketEntity.addRelation(entity);
    onClose();
  }, [ticketEntity, onClose, entity]);

  const handleSubmitButtonClick = React.useCallback(
    () => entity.submit({ onSuccess: handleCreateRelation }),
    [entity, handleCreateRelation],
  );

  return (
    <div className={wrapperStyles}>
      <FormFieldSelect
        className={typeFieldStyles}
        edit
        required
        value={entity.type}
        errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.type, t)}
        options={relationTypesSelectOptions}
        onChange={entity.setType}
      />
      <FormFieldSelect
        className={ticketFieldStyles}
        edit
        searchable
        customOnSearch={ticketFilterEntity.setSearch}
        required
        errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.relatedTicketId, t)}
        value={entity.relatedTicketId}
        options={ticketSelectOptions}
        onChange={entity.setRelatedTicketId}
      />
      <div className={actionsWrapperStyles}>
        <Button type="WITHOUT_BORDER" size="SMALL" iconLeft="checkLine" onClick={handleSubmitButtonClick} />
        <Button type="WITHOUT_BORDER" size="SMALL" iconLeft="closeLine" onClick={onClose} />
      </div>
    </div>
  );
}

export default observer(CreateTicketRelationRow);

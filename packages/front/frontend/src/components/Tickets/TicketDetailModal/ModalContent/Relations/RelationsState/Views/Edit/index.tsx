import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";
import { useBoolean, useAsyncFn } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";
import { EditTicketRelationEntity } from "core/storages/ticket/entities/EditTicketRelation";

import { TicketsStorage } from "core/storages/ticket";
import { TicketRelationsStorage } from "core/storages/ticket/relations";

import CreateTicketRelationRow from "../../Rows/CreateTicketRelationRow";
import TicketRelationRow from "../../Rows/TicketRelationRow";
import LoadingState from "../../../LoadingState";

import { useLoadRelations } from "./hooks";

import { createTicketRelationButtonStyles, wrapperStyles } from "./style.css";

interface EditRelationsInterface {
  editTicketEntity: EditTicketEntity;
}

function EditRelations({ editTicketEntity }: EditRelationsInterface) {
  const { ticketFilterEntity } = useLoadRelations();

  const { containerInstance } = useViewContext();
  const { ticketDetail } = containerInstance.get(TicketsStorage);
  const { loadTicketRelations } = containerInstance.get(TicketRelationsStorage);

  const [{ loading: relationsLoading }, asyncLoadTicketRelations] = useAsyncFn(
    loadTicketRelations,
    [loadTicketRelations],
    { loading: !!editTicketEntity.id },
  );

  React.useEffect(() => {
    if (!ticketDetail) return;
    asyncLoadTicketRelations(ticketDetail.id, { loadOnlyAsMainRelated: true }).then((result) => {
      if (!result.success) return;
      editTicketEntity.setRelations(result.data.map(EditTicketRelationEntity.buildFromTicketRelation));
    });
  }, [asyncLoadTicketRelations, ticketDetail, editTicketEntity]);

  const [opened, open, close] = useBoolean(false);

  if (relationsLoading) return <LoadingState />;

  return (
    <div className={wrapperStyles}>
      {editTicketEntity.relations.map((relation, index) => (
        <TicketRelationRow
          key={index}
          edit
          ticketId={relation.relatedTicketId!}
          relationType={relation.type}
          index={index}
          editTicketEntity={editTicketEntity}
          isMainTicket
        />
      ))}
      {opened ? (
        <CreateTicketRelationRow
          ticketFilterEntity={ticketFilterEntity}
          ticketEntity={editTicketEntity}
          onClose={close}
        />
      ) : (
        <Button
          className={createTicketRelationButtonStyles}
          type="WITHOUT_BORDER"
          size="SMALL"
          iconLeft="plusLine"
          onClick={open}
        />
      )}
    </div>
  );
}

export default observer(EditRelations);

import { observer } from "mobx-react-lite";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import ViewRelations from "./Views/View";
import EditRelations from "./Views/Edit";

interface RelationsStateInterface {
  edit: boolean;
  editTicketEntity?: EditTicketEntity;
}

function RelationsState({ edit, editTicketEntity }: RelationsStateInterface) {
  if (edit) return <EditRelations editTicketEntity={editTicketEntity!} />;
  return <ViewRelations />;
}

export default observer(RelationsState);

import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";
import { useAsyncFn, useBoolean } from "@worksolutions/react-utils";
import { Spinner } from "@app/ui-kit";

import { TicketsStorage } from "core/storages/ticket";

import TicketDetailModalEditMode from "./ModalModes/Edit";
import TicketDetailModalViewMode from "./ModalModes/View";

import { spinnerStyles } from "./style.css";

interface TicketDetailModalContentInterface {
  ticketId: string | null;
  close: () => void;
}

function TicketDetailModalContent({ ticketId, close }: TicketDetailModalContentInterface) {
  const { ticketDetail, loadTicketDetail } = useViewContext().containerInstance.get(TicketsStorage);
  const [{ loading }, asyncLoadTicketDetail] = useAsyncFn(loadTicketDetail, [loadTicketDetail], { loading: true });

  React.useEffect(() => {
    if (!ticketId) return;
    void asyncLoadTicketDetail(ticketId);
  }, [asyncLoadTicketDetail, ticketId]);

  const [editMode, enableEditMode, disableEditMode] = useBoolean(false);

  if (loading) return <Spinner className={spinnerStyles} />;
  if (!ticketDetail) return null;

  if (editMode) return <TicketDetailModalEditMode ticket={ticketDetail} disableEditMode={disableEditMode} />;

  return <TicketDetailModalViewMode ticket={ticketDetail} enableEditMode={enableEditMode} closeModal={close} />;
}

export default observer(TicketDetailModalContent);

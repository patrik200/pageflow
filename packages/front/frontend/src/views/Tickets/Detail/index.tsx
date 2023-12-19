import React from "react";
import { observer } from "mobx-react-lite";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import { TicketsStorage } from "core/storages/ticket";

import PageWrapper from "../../_PageWrapper";
import EditMode from "./Modes/Edit";
import ViewMode from "./Modes/View";

function DetailTicketView() {
  const { t } = useTranslation("ticket-detail");
  const { slug } = useRouter().query as { slug: string };

  const { ticketDetail, loadTicketDetail } = useViewContext().containerInstance.get(TicketsStorage);
  const [{ loading }, asyncLoadTicketDetail] = useAsyncFn(loadTicketDetail, [loadTicketDetail], { loading: true });
  React.useEffect(() => void asyncLoadTicketDetail(slug), [asyncLoadTicketDetail, slug]);

  const [editEntity, setEditEntity] = React.useState<EditTicketEntity | null>(null);

  const handleResetEditMode = React.useCallback(() => setEditEntity(null), []);
  const handleEnableEditMode = React.useCallback(
    () => setEditEntity(EditTicketEntity.buildFromTicketEntity(ticketDetail!)),
    [ticketDetail],
  );

  return (
    <PageWrapper
      loading={loading}
      title={
        ticketDetail
          ? t({ scope: "meta", name: "view" }, { name: ticketDetail.name })
          : t({ scope: "meta", name: "view_placeholder" })
      }
    >
      {ticketDetail && (
        <>
          {editEntity ? (
            <EditMode entity={editEntity} ticket={ticketDetail} closeEditing={handleResetEditMode} />
          ) : (
            <ViewMode ticket={ticketDetail} onEnableEditMode={handleEnableEditMode} />
          )}
        </>
      )}
    </PageWrapper>
  );
}

export default observer(DetailTicketView);

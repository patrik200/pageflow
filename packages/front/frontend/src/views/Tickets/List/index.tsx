import React from "react";
import { observer } from "mobx-react-lite";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useTranslation, useViewContext } from "@app/front-kit";

import { TicketBoardsStorage } from "core/storages/ticket/boards";

import PageWrapper from "../../_PageWrapper";
import TicketBoardContent from "./BoardContent";

function TicketsView() {
  const { t } = useTranslation("tickets");

  const { loadTicketBoards } = useViewContext().containerInstance.get(TicketBoardsStorage);
  const [{ loading }, asyncLoadBoards] = useAsyncFn(loadTicketBoards, [loadTicketBoards], { loading: true });
  React.useEffect(() => void asyncLoadBoards({ projectId: null }), [asyncLoadBoards]);

  return (
    <PageWrapper loading={loading} title={t({ scope: "meta", name: "title" })}>
      <TicketBoardContent />
    </PageWrapper>
  );
}

export default observer(TicketsView);

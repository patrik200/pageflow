import React from "react";
import { observer } from "mobx-react-lite";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useRouter, useViewContext } from "@app/front-kit";

import CardLoadingPreset from "components/Card/pressets/CardLoading";

import { TicketBoardsStorage } from "core/storages/ticket/boards";

import ProjectTicketBoardContent from "./BoardContent";

function ProjectTicketsKanbanView() {
  const projectId = useRouter().query.id as string;

  const { loadTicketBoards } = useViewContext().containerInstance.get(TicketBoardsStorage);
  const [{ loading }, asyncLoadBoards] = useAsyncFn(loadTicketBoards, [loadTicketBoards], { loading: true });
  React.useEffect(() => void asyncLoadBoards({ projectId }), [asyncLoadBoards, projectId]);

  if (loading) return <CardLoadingPreset />;

  return <ProjectTicketBoardContent projectId={projectId} />;
}

export default observer(ProjectTicketsKanbanView);

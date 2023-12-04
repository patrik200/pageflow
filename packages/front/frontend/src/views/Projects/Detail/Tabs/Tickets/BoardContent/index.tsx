import React from "react";
import { observer } from "mobx-react-lite";
import { SelectField } from "@app/ui-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import TicketsCard from "components/Tickets/TicketsCard";
import Card from "components/Card";
import { useBoardSelectOptions, useCurrentBoardId } from "components/Tickets/Boards/hooks";
import CreateBoardAction from "components/Tickets/Boards/CreateBoardAction";
import AdditionalBoardActions from "components/Tickets/Boards/AdditionalBoardActions";

import { TicketBoardsStorage } from "core/storages/ticket/boards";

import { boardActionsWrapperStyles } from "./style.css";

interface ProjectTicketBoardContentInterface {
  projectId: string;
}

function ProjectTicketBoardContent({ projectId }: ProjectTicketBoardContentInterface) {
  const boardSelectOptions = useBoardSelectOptions();
  const [boardId, handleChangeBoard] = useCurrentBoardId("project_" + projectId, boardSelectOptions);
  const { boards, loadPermissions } = useViewContext().containerInstance.get(TicketBoardsStorage);

  const board = useObservableAsDeferredMemo(
    (boards) => (boardId ? boards.find((board) => board.id === boardId) : undefined),
    [boardId],
    boards,
  );

  React.useEffect(() => {
    if (!board) return;
    loadPermissions(board.id);
  }, [board, boardId, loadPermissions]);

  return (
    <>
      <Card>
        <div className={boardActionsWrapperStyles}>
          <CreateBoardAction projectId={projectId} onCreated={handleChangeBoard} />
          {board && (
            <>
              <SelectField
                size="small"
                value={boardId}
                popupWidth="auto"
                options={boardSelectOptions}
                onChange={handleChangeBoard}
              />
              <AdditionalBoardActions board={board} />
            </>
          )}
        </div>
      </Card>
      {board && <TicketsCard projectId={projectId} boardId={board.id} />}
    </>
  );
}

export default observer(ProjectTicketBoardContent);

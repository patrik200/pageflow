import React from "react";
import { observer } from "mobx-react-lite";
import { SelectField } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import TicketsCard from "components/Tickets/TicketsCard";
import CreateBoardAction from "components/Tickets/Boards/CreateBoardAction";
import { useBoardSelectOptions, useCurrentBoardId } from "components/Tickets/Boards/hooks";
import AdditionalBoardActions from "components/Tickets/Boards/AdditionalBoardActions";

import { TicketBoardsStorage } from "core/storages/ticket/boards";

function TicketBoardContent() {
  const { t } = useTranslation("tickets");
  const { boards, loadPermissions } = useViewContext().containerInstance.get(TicketBoardsStorage);

  const boardSelectOptions = useBoardSelectOptions();

  const [boardId, handleChangeBoard] = useCurrentBoardId("client", boardSelectOptions);

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
      <CardTitlePreset
        title={t({ scope: "meta", name: "title" })}
        actions={
          <>
            <CreateBoardAction onCreated={handleChangeBoard} />
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
          </>
        }
      />
      {board && <TicketsCard boardId={board.id} />}
    </>
  );
}

export default observer(TicketBoardContent);

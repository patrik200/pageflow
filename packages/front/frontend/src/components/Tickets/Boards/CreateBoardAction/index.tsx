import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { TicketBoardEntity } from "core/entities/ticket/ticketBoard";

import EditTicketBoardModal from "../AdditionalBoardActions/EditBoardAction/EditTicketBoardModal";

interface CreateBoardActionInterface {
  projectId?: string;
  onCreated: (id: string) => void;
}

function CreateBoardAction({ projectId, onCreated }: CreateBoardActionInterface) {
  const { t } = useTranslation("tickets");
  const [opened, open, close] = useBoolean(false);

  const handleSuccess = React.useCallback((board: TicketBoardEntity) => onCreated(board.id), [onCreated]);

  return (
    <>
      <Button size="SMALL" iconLeft="plusLine" type="OUTLINE" onClick={open}>
        {t({ scope: "actions", name: "create_board", parameter: "button" })}
      </Button>
      <EditTicketBoardModal opened={opened} projectId={projectId} onClose={close} onSuccess={handleSuccess} />
    </>
  );
}

export default observer(CreateBoardAction);

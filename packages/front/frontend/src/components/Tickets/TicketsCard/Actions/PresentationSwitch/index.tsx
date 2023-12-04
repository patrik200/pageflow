import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";

import { TicketsStorage } from "core/storages/ticket";

function PresentationSwitchAction() {
  const { t } = useTranslation();
  const { filter } = useViewContext().containerInstance.get(TicketsStorage);

  return (
    <Button
      size="SMALL"
      type="OUTLINE"
      iconLeft={filter.presentationType === "kanban" ? "editorListUnordered" : "tableLine"}
      onClick={filter.switchPresentationType}
    >
      {t({ scope: "kanban", name: "ticket_presentation_switch" })}
    </Button>
  );
}

export default observer(PresentationSwitchAction);

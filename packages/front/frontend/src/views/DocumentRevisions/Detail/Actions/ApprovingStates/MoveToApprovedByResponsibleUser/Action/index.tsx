import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import MoveToApprovedStatusModal from "./Modal";

import { buttonStyles } from "./style.css";

function MoveToApprovedActionByResponsibleUserButton() {
  const { t } = useTranslation("document-revision-detail");
  const [opened, open, close] = useBoolean(false);

  return (
    <>
      <Button className={buttonStyles} size="SMALL" onClick={open}>
        {t({
          scope: "view_revision",
          place: "action_statuses",
          name: "move_to_approved_by_responsible_user",
          parameter: "button",
        })}
      </Button>
      <MoveToApprovedStatusModal opened={opened} onClose={close} />
    </>
  );
}

export default observer(MoveToApprovedActionByResponsibleUserButton);

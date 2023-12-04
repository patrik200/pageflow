import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentStorage } from "core/storages/document";

import MoveToReturnModal from "./Modal";

import { buttonStyles } from "./style.css";

function DocumentRevisionMoveToReturnAction() {
  const { t } = useTranslation("document-revision-detail");
  const [opened, open, close] = useBoolean(false);

  const { containerInstance } = useViewContext();

  const { revisionDetail } = containerInstance.get(DocumentRevisionsStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);

  if (!documentDetail?.resultCanEdit) return null;
  if (!revisionDetail!.canMoveToReturnStatus) return null;

  return (
    <>
      <Button className={buttonStyles} size="SMALL" onClick={open}>
        {t({ scope: "view_revision", place: "action_statuses", name: "move_to_return", parameter: "button" })}
      </Button>
      <MoveToReturnModal opened={opened} onClose={close} />
    </>
  );
}

export default observer(DocumentRevisionMoveToReturnAction);

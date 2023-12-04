import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

import DocumentRevisionProlongApprovingDateModal from "./ProlongApprovingDateModal";
import { DocumentStorage } from "../../../../../core/storages/document";

import { buttonStyles } from "./style.css";

function DocumentRevisionProlongApprovingDateAction() {
  const { t } = useTranslation("document-revision-detail");

  const [opened, open, close] = useBoolean(false);

  const { containerInstance } = useViewContext();

  const { revisionDetail } = containerInstance.get(DocumentRevisionsStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);

  if (documentDetail?.resultCanEdit) return null;
  if (!revisionDetail!.canRunProlongApprovingDeadline) return null;

  return (
    <>
      <Button className={buttonStyles} size="SMALL" onClick={open}>
        {t({ scope: "view_revision", place: "actions", name: "prolong_approving_date" })}
      </Button>
      <DocumentRevisionProlongApprovingDateModal opened={opened} close={close} />
    </>
  );
}

export default observer(DocumentRevisionProlongApprovingDateAction);

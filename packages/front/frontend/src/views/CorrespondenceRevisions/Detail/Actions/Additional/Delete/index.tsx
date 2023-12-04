import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";
import { CorrespondenceStorage } from "core/storages/correspondence";

import DeleteCorrespondenceRevisionModal from "../../../../Modals/Delete";

interface DeleteCorrespondenceRevisionActionInterface {
  openedOnChange: (opened: boolean) => void;
}

function DeleteCorrespondenceRevisionAction({ openedOnChange }: DeleteCorrespondenceRevisionActionInterface) {
  const { t } = useTranslation("correspondence-revision-detail");
  const [opened, open, close] = useBoolean(false);
  React.useEffect(() => openedOnChange(opened), [opened, openedOnChange]);

  const { containerInstance } = useViewContext();
  const revision = containerInstance.get(CorrespondenceRevisionsStorage).revisionDetail!;
  const correspondence = containerInstance.get(CorrespondenceStorage).correspondenceDetail;

  if (!correspondence?.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton text={t({ scope: "view_revision", place: "actions", name: "delete" })} onClick={open} />
      <DeleteCorrespondenceRevisionModal revision={revision} opened={opened} close={close} />
    </>
  );
}

export default observer(DeleteCorrespondenceRevisionAction);

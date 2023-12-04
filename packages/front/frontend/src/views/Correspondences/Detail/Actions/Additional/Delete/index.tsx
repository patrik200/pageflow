import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter, useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import DeleteCorrespondenceModal from "../../../../Modals/DeleteCorrespondence";

interface DeleteCorrespondenceActionInterface {
  correspondence: CorrespondenceEntity;
  onOpenedChange: (opened: boolean) => void;
}

function DeleteCorrespondenceAction({ correspondence, onOpenedChange }: DeleteCorrespondenceActionInterface) {
  const { push } = useRouter();
  const { t } = useTranslation("correspondence-detail");

  const [deleteOpened, openDelete, closeDelete] = useBoolean(false);
  React.useEffect(() => onOpenedChange(deleteOpened), [deleteOpened, onOpenedChange]);

  const handleDeleteSuccess = React.useCallback(() => push.current("/correspondences"), [push]);

  if (!correspondence.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton
        text={t({ scope: "delete_correspondence", place: "action", name: "delete" })}
        onClick={openDelete}
      />
      <DeleteCorrespondenceModal
        correspondence={correspondence}
        opened={deleteOpened}
        close={closeDelete}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}

export default observer(DeleteCorrespondenceAction);

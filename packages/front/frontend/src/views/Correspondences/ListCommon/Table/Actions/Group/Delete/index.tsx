import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

import { CorrespondenceStorage } from "core/storages/correspondence";

import DeleteCorrespondenceGroupModal from "../../../../../Modals/DeleteGroup";

interface DeleteCorrespondenceGroupActionInterface {
  entity: CorrespondenceGroupEntity;
  onOpenedChange: (opened: boolean) => void;
}

function DeleteCorrespondenceGroupAction({ entity, onOpenedChange }: DeleteCorrespondenceGroupActionInterface) {
  const { t } = useTranslation("correspondence-list");

  const [deleteOpened, openDelete, closeDelete] = useBoolean(false);
  React.useEffect(() => onOpenedChange(deleteOpened), [deleteOpened, onOpenedChange]);

  const { loadGroupsAndCorrespondences } = useViewContext().containerInstance.get(CorrespondenceStorage);
  const handleReload = React.useCallback(() => loadGroupsAndCorrespondences(), [loadGroupsAndCorrespondences]);
  if (!entity.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton
        text={t({ scope: "table", place: "body_group", name: "actions", parameter: "delete" })}
        onClick={openDelete}
      />
      <DeleteCorrespondenceGroupModal
        opened={deleteOpened}
        group={entity}
        close={closeDelete}
        onSuccess={handleReload}
      />
    </>
  );
}

export default observer(DeleteCorrespondenceGroupAction);

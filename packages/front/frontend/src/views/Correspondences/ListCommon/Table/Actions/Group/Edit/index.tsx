import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

import { CorrespondenceStorage } from "core/storages/correspondence";

import EditCorrespondenceGroupModal from "../../../../../Modals/EditGroup";

interface EditCorrespondenceGroupActionInterface {
  entity: CorrespondenceGroupEntity;
  onOpenedChange: (opened: boolean) => void;
}

function EditCorrespondenceGroupAction({ entity, onOpenedChange }: EditCorrespondenceGroupActionInterface) {
  const { t } = useTranslation("correspondence-list");

  const [editOpened, openEdit, closeEdit] = useBoolean(false);
  React.useEffect(() => onOpenedChange(editOpened), [editOpened, onOpenedChange]);

  const { loadGroupsAndCorrespondences } = useViewContext().containerInstance.get(CorrespondenceStorage);
  const handleReload = React.useCallback(() => loadGroupsAndCorrespondences(), [loadGroupsAndCorrespondences]);
  if (!entity.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton
        text={t({ scope: "table", place: "body_group", name: "actions", parameter: "edit" })}
        onClick={openEdit}
      />
      <EditCorrespondenceGroupModal opened={editOpened} group={entity} close={closeEdit} onSuccess={handleReload} />
    </>
  );
}

export default observer(EditCorrespondenceGroupAction);

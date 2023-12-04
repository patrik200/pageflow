import React from "react";
import { observer } from "mobx-react-lite";
import { ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";

import FormFieldPermissionsList from "components/FormField/PermissionsList";

import { PermissionEntity } from "core/entities/permission/permision";
import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";
import { EditCorrespondenceGroupEntity } from "core/storages/correspondence/entities/correspondence/EditGroup";

import { CorrespondenceStorage } from "core/storages/correspondence";

import { wrapperStyles } from "./style.css";

interface CorrespondenceGroupPermissionsModalContentInterface {
  group: CorrespondenceGroupEntity;
}

function CorrespondenceGroupPermissionsModalContent({ group }: CorrespondenceGroupPermissionsModalContentInterface) {
  const { t } = useTranslation("correspondence");
  const {
    createCorrespondenceGroupPermission,
    deleteCorrespondenceGroupPermission,
    editCorrespondenceGroupPermission,
  } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const editGroup = React.useMemo(() => EditCorrespondenceGroupEntity.buildFromCorrespondenceGroup(group), [group]);

  const handleCreate = React.useCallback(
    async (entity: PermissionEntity) => {
      const result = await createCorrespondenceGroupPermission(editGroup, entity);
      if (result.success) return true;
      return result.error;
    },
    [createCorrespondenceGroupPermission, editGroup],
  );

  const handleEdit = React.useCallback(
    async (entity: PermissionEntity) => {
      const result = await editCorrespondenceGroupPermission(editGroup, entity);
      if (result.success) return true;
      return result.error;
    },
    [editCorrespondenceGroupPermission, editGroup],
  );

  const handleDelete = React.useCallback(
    async (entity: PermissionEntity) => {
      const result = await deleteCorrespondenceGroupPermission(editGroup, entity.user.id);
      if (result.success) return true;
      return result.error;
    },
    [deleteCorrespondenceGroupPermission, editGroup],
  );

  return (
    <>
      <ModalTitle>{t({ scope: "permissions_group_modal", name: "title" })}</ModalTitle>
      <div className={wrapperStyles}>
        <FormFieldPermissionsList
          permissions={editGroup.permissions}
          isPrivate={editGroup.isPrivate}
          editing
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default observer(CorrespondenceGroupPermissionsModalContent);

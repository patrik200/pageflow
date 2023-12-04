import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import FormFieldPermissionsList from "components/FormField/PermissionsList";

import { EditCorrespondenceEntity } from "core/storages/correspondence/entities/correspondence/EditCorrespondence";
import { PermissionEntity } from "core/entities/permission/permision";

import { CorrespondenceStorage } from "core/storages/correspondence";

interface CorrespondencePermissionsListInterface {
  editing: boolean;
  loading?: boolean;
  entity: EditCorrespondenceEntity;
}

function CorrespondencePermissionsList({ loading, editing, entity }: CorrespondencePermissionsListInterface) {
  const { createCorrespondencePermission, editCorrespondencePermission, deleteCorrespondencePermission } =
    useViewContext().containerInstance.get(CorrespondenceStorage);

  const handleCreate = React.useCallback(
    async (newPermission: PermissionEntity) => {
      const result = await createCorrespondencePermission(entity, newPermission);
      if (result.success) return true;
      return result.error;
    },
    [createCorrespondencePermission, entity],
  );

  const handleEdit = React.useCallback(
    async (newPermission: PermissionEntity) => {
      const result = await editCorrespondencePermission(entity, newPermission);
      if (result.success) return true;
      return result.error;
    },
    [editCorrespondencePermission, entity],
  );

  const handleDelete = React.useCallback(
    async (newPermission: PermissionEntity) => {
      const result = await deleteCorrespondencePermission(entity, newPermission.user.id);
      if (result.success) return true;
      return result.error;
    },
    [deleteCorrespondencePermission, entity],
  );

  return (
    <FormFieldPermissionsList
      loading={loading}
      isPrivate={entity.isPrivate}
      permissions={entity.permissions}
      editing={editing}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

export default observer(CorrespondencePermissionsList);

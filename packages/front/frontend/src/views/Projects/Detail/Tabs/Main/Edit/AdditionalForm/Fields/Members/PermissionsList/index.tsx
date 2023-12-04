import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import FormFieldPermissionsList from "components/FormField/PermissionsList";

import { EditProjectEntity } from "core/storages/project/entities/EditProject";
import { PermissionEntity } from "core/entities/permission/permision";

import { ProjectStorage } from "core/storages/project";

interface ProjectPermissionsListInterface {
  editing: boolean;
  loading?: boolean;
  entity: EditProjectEntity;
}

function ProjectPermissionsList({ loading, editing, entity }: ProjectPermissionsListInterface) {
  const { createPermission, editPermission, deletePermission } = useViewContext().containerInstance.get(ProjectStorage);

  const handleCreate = React.useCallback(
    async (newPermission: PermissionEntity) => {
      const result = await createPermission(entity, newPermission);
      if (result.success) return true;
      return result.error;
    },
    [createPermission, entity],
  );

  const handleEdit = React.useCallback(
    async (newPermission: PermissionEntity) => {
      const result = await editPermission(entity, newPermission);
      if (result.success) return true;
      return result.error;
    },
    [editPermission, entity],
  );

  const handleDelete = React.useCallback(
    async (newPermission: PermissionEntity) => {
      const result = await deletePermission(entity, newPermission.user.id);
      if (result.success) return true;
      return result.error;
    },
    [deletePermission, entity],
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

export default observer(ProjectPermissionsList);

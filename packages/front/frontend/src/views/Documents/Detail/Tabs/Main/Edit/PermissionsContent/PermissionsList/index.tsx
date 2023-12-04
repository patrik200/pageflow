import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import FormFieldPermissionsList from "components/FormField/PermissionsList";

import { PermissionEntity } from "core/entities/permission/permision";
import { EditDocumentEntity } from "core/storages/document/entities/document/EditDocument";

import { DocumentStorage } from "core/storages/document";

interface DocumentPermissionsListInterface {
  editing: boolean;
  loading?: boolean;
  entity: EditDocumentEntity;
}

function DocumentPermissionsList({ editing, loading, entity }: DocumentPermissionsListInterface) {
  const { createDocumentPermission, editDocumentPermission, deleteDocumentPermission } =
    useViewContext().containerInstance.get(DocumentStorage);

  const handleCreate = React.useCallback(
    async (newPermission: PermissionEntity) => {
      const result = await createDocumentPermission(entity, newPermission);
      if (result.success) return true;
      return result.error;
    },
    [createDocumentPermission, entity],
  );

  const handleEdit = React.useCallback(
    async (newPermission: PermissionEntity) => {
      const result = await editDocumentPermission(entity, newPermission);
      if (result.success) return true;
      return result.error;
    },
    [editDocumentPermission, entity],
  );

  const handleDelete = React.useCallback(
    async (newPermission: PermissionEntity) => {
      const result = await deleteDocumentPermission(entity, newPermission.user.id);
      if (result.success) return true;
      return result.error;
    },
    [deleteDocumentPermission, entity],
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

export default observer(DocumentPermissionsList);

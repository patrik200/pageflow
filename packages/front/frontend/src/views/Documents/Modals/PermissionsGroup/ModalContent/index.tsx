import React from "react";
import { observer } from "mobx-react-lite";
import { ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";

import FormFieldPermissionsList from "components/FormField/PermissionsList";

import { PermissionEntity } from "core/entities/permission/permision";
import { DocumentGroupEntity } from "core/entities/document/group";
import { EditDocumentGroupEntity } from "core/storages/document/entities/document/EditGroup";

import { DocumentStorage } from "core/storages/document";

import { wrapperStyles } from "./style.css";

interface DocumentGroupPermissionsModalContentInterface {
  group: DocumentGroupEntity;
}

function DocumentGroupPermissionsModalContent({ group }: DocumentGroupPermissionsModalContentInterface) {
  const { t } = useTranslation("document");
  const { createDocumentGroupPermission, deleteDocumentGroupPermission, editDocumentGroupPermission } =
    useViewContext().containerInstance.get(DocumentStorage);

  const editGroup = React.useMemo(() => EditDocumentGroupEntity.buildFromDocumentGroup(group), [group]);

  const handleCreate = React.useCallback(
    async (entity: PermissionEntity) => {
      const result = await createDocumentGroupPermission(editGroup, entity);
      if (result.success) return true;
      return result.error;
    },
    [createDocumentGroupPermission, editGroup],
  );

  const handleEdit = React.useCallback(
    async (entity: PermissionEntity) => {
      const result = await editDocumentGroupPermission(editGroup, entity);
      if (result.success) return true;
      return result.error;
    },
    [editDocumentGroupPermission, editGroup],
  );

  const handleDelete = React.useCallback(
    async (entity: PermissionEntity) => {
      const result = await deleteDocumentGroupPermission(editGroup, entity.user.id);
      if (result.success) return true;
      return result.error;
    },
    [deleteDocumentGroupPermission, editGroup],
  );

  return (
    <>
      <ModalTitle>{t({ scope: "permissions_group_modal", name: "title" })}</ModalTitle>
      <div className={wrapperStyles}>
        <FormFieldPermissionsList
          permissions={editGroup.permissions}
          editing
          isPrivate={group.isPrivate}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default observer(DocumentGroupPermissionsModalContent);

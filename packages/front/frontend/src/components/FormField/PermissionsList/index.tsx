import React from "react";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";
import { ParseServerErrorResult } from "@app/front-kit";

import { PermissionEntity } from "core/entities/permission/permision";

import FormFieldEditableEditPermission, {
  useFormFieldEditableEditPermissionForceClose,
} from "../Permission/Editable/EditNewPermission";
import FormFieldEditableCreatePermission from "../Permission/Editable/CreateNewPermission";
import FormFieldPermission from "../Permission";

interface FormFieldPermissionsListInterface {
  isPrivate: boolean;
  loading?: boolean;
  editing: boolean;
  permissions: PermissionEntity[];
  onEdit: (entity: PermissionEntity) => Promise<true | ParseServerErrorResult>;
  onDelete: (entity: PermissionEntity) => Promise<true | ParseServerErrorResult>;
  onCreate: (entity: PermissionEntity) => Promise<true | ParseServerErrorResult>;
}

function FormFieldPermissionsList({
  isPrivate,
  loading,
  editing,
  permissions,
  onEdit,
  onDelete,
  onCreate,
}: FormFieldPermissionsListInterface) {
  const [createOpened, openCreate, closeCreate] = useBoolean(false);

  const {
    forceClose,
    onClose: forceCloseOnClose,
    onOpen: forceCloseOnOpen,
  } = useFormFieldEditableEditPermissionForceClose();

  if (editing)
    return (
      <>
        {permissions.map((permission) => (
          <FormFieldEditableEditPermission
            key={permission.user.id}
            isPrivate={isPrivate}
            disabled={loading}
            permission={permission}
            allPermissions={permissions}
            forceClose={forceClose(permission)}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpen={forceCloseOnOpen}
            onClose={forceCloseOnClose}
          />
        ))}
        <FormFieldEditableCreatePermission
          isPrivate={isPrivate}
          opened={createOpened}
          allPermissions={permissions}
          disabled={loading}
          trigger={
            <Button size="SMALL" disabled={loading} type="WITHOUT_BORDER" iconLeft="plusLine" onClick={openCreate} />
          }
          onCreate={onCreate}
          onClose={closeCreate}
        />
      </>
    );

  return (
    <>
      {permissions.map((permission) => (
        <FormFieldPermission
          key={permission.user.id}
          isPrivate={isPrivate}
          view
          allPermissions={permissions}
          permission={permission}
          editable={false}
        />
      ))}
    </>
  );
}

export default observer(FormFieldPermissionsList);

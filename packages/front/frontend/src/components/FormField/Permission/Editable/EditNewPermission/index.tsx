import React from "react";
import { observer } from "mobx-react-lite";
import { ParseServerErrorResult } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { PermissionEntity } from "core/entities/permission/permision";

import FormFieldPermission from "../../index";

interface FormFieldEditableEditPermissionInterface {
  isPrivate: boolean;
  disabled?: boolean;
  forceClose?: boolean;
  permission: PermissionEntity;
  allPermissions: PermissionEntity[];
  onEdit: (entity: PermissionEntity) => Promise<true | ParseServerErrorResult>;
  onDelete: (entity: PermissionEntity) => Promise<true | ParseServerErrorResult>;
  onOpen?: (userId: string) => void;
  onClose?: () => void;
}

function FormFieldEditableEditPermission({
  isPrivate,
  disabled,
  forceClose,
  permission,
  allPermissions,
  onEdit,
  onDelete,
  onOpen,
  onClose,
}: FormFieldEditableEditPermissionInterface) {
  const [opened, open, close] = useBoolean(false);
  React.useEffect(() => {
    if (forceClose) close();
  }, [close, forceClose]);

  React.useEffect(() => {
    if (opened) onOpen?.(permission.user.id);
    else onClose?.();
  }, [onClose, onOpen, opened, permission.user.id]);

  if (opened)
    return (
      <FormFieldPermission
        edit
        isPrivate={isPrivate}
        allPermissions={allPermissions}
        permission={permission}
        onDelete={onDelete}
        onSave={onEdit}
        onClose={close}
      />
    );

  return (
    <FormFieldPermission
      view
      isPrivate={isPrivate}
      disabled={disabled}
      allPermissions={allPermissions}
      permission={permission}
      onEdit={open}
    />
  );
}

export default observer(FormFieldEditableEditPermission);

export function useFormFieldEditableEditPermissionForceClose() {
  const [forceCloseEditExcludeUserId, setForceCloseEditExcludeUserId] = React.useState<string | null>(null);
  const disableForceCloseEdit = React.useCallback(() => setForceCloseEditExcludeUserId(null), []);
  const getForceClose = React.useCallback(
    (permission: PermissionEntity) =>
      forceCloseEditExcludeUserId ? forceCloseEditExcludeUserId !== permission.user.id : false,
    [forceCloseEditExcludeUserId],
  );

  return { forceClose: getForceClose, onOpen: setForceCloseEditExcludeUserId, onClose: disableForceCloseEdit };
}

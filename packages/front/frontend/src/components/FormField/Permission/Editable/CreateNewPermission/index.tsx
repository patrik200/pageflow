import React from "react";
import { observer } from "mobx-react-lite";
import { ParseServerErrorResult, useViewContext } from "@app/front-kit";

import { PermissionEntity } from "core/entities/permission/permision";

import { ProfileStorage } from "core/storages/profile/profile";

import FormFieldPermission, { useCurrentUserPermission } from "../../index";

interface FormFieldEditableCreatePermissionInterface {
  isPrivate: boolean;
  disabled?: boolean;
  opened: boolean;
  trigger: React.ReactNode;
  allPermissions: PermissionEntity[];
  onCreate: (entity: PermissionEntity) => Promise<true | ParseServerErrorResult>;
  onClose: () => void;
}

function FormFieldEditableCreatePermission({
  isPrivate,
  disabled,
  opened,
  trigger,
  allPermissions,
  onCreate,
  onClose,
}: FormFieldEditableCreatePermissionInterface) {
  const currentUserPermission = useCurrentUserPermission(allPermissions, isPrivate);
  const { user } = useViewContext().containerInstance.get(ProfileStorage);

  if (!user.isAdmin) {
    if (!currentUserPermission) return null;
    if (
      (isPrivate ? currentUserPermission.rolesCanCreateForPrivate : currentUserPermission.rolesCanCreateForPublic)
        .length === 0
    )
      return null;
  }

  if (opened)
    return (
      <FormFieldPermission
        edit
        isPrivate={isPrivate}
        disabled={disabled}
        allPermissions={allPermissions}
        onCreate={onCreate}
        onClose={onClose}
      />
    );

  return <>{trigger}</>;
}

export default observer(FormFieldEditableCreatePermission);

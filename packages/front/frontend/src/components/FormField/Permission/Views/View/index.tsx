import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Typography } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { PermissionRole } from "@app/shared-enums";

import { PermissionEntity } from "core/entities/permission/permision";

import { ProfileStorage } from "core/storages/profile/profile";

import UserRow from "../../../../UserRow";
import { useCurrentUserPermission } from "../Edit";

import {
  roleModifierTextStyles,
  roleModifierWrapperStyles,
  roleTextStyles,
  roleWrapperStyles,
  userRowStyles,
  wrapperStyles,
} from "./style.css";

export interface ViewPermissionInterface {
  isPrivate: boolean;
  disabled?: boolean;
  allPermissions?: PermissionEntity[];
  permission: PermissionEntity;
  editable?: boolean;
  onEdit?: () => void;
}

function ViewPermission({
  isPrivate,
  disabled = false,
  allPermissions,
  permission,
  editable = true,
  onEdit,
}: ViewPermissionInterface) {
  const { t } = useTranslation();

  const currentUserPermission = useCurrentUserPermission(allPermissions, isPrivate);
  const { user } = useViewContext().containerInstance.get(ProfileStorage);

  return (
    <div className={wrapperStyles}>
      <div className={userRowStyles}>
        <UserRow user={permission.user} />
        <div className={roleWrapperStyles}>
          <Typography className={roleTextStyles}>
            {t({ scope: "permissions", place: "role", name: permission.role })}
          </Typography>
          {editable && !disabled && getCanEdit(user.isAdmin, currentUserPermission, permission) && (
            <Button type="WITHOUT_BORDER" size="SMALL" iconLeft="editLine" onClick={onEdit} />
          )}
        </div>
      </div>
      {(permission.canEditEditorPermissions || permission.canEditReaderPermissions) && (
        <div className={roleModifierWrapperStyles}>
          {permission.canEditEditorPermissions && (
            <Typography className={roleModifierTextStyles}>
              {t({ scope: "permissions", place: "role_modifier", name: "can_edit_editor_permission" })}
            </Typography>
          )}
          {isPrivate && permission.canEditReaderPermissions && (
            <Typography className={roleModifierTextStyles}>
              {t({ scope: "permissions", place: "role_modifier", name: "can_edit_reader_permission" })}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}

export default observer(ViewPermission);

function getCanEdit(
  currentUserIsAdmin: boolean,
  currentUserPermission: PermissionEntity | undefined,
  permission: PermissionEntity,
) {
  if (permission.role === PermissionRole.OWNER) return false;
  if (currentUserIsAdmin) return true;
  if (!currentUserPermission) return false;
  if (currentUserPermission.role === PermissionRole.OWNER) return true;
  if (currentUserPermission.user.id === permission.user.id) return true;
  if (currentUserPermission.role === PermissionRole.READER) {
    if (permission.role === PermissionRole.READER && currentUserPermission.canEditReaderPermissions) return true;
    return false;
  }
  if (currentUserPermission.role === PermissionRole.EDITOR) {
    if (permission.role === PermissionRole.READER) return true;
    if (permission.role === PermissionRole.EDITOR && currentUserPermission.canEditEditorPermissions) return true;
    return false;
  }
  return false;
}

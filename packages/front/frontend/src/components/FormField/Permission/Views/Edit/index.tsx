import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Checkbox } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, ParseServerErrorResult, useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { PermissionRole } from "@app/shared-enums";

import { emitRequestError } from "core/emitRequest";

import { PermissionEntity } from "core/entities/permission/permision";

import { ProfileStorage } from "core/storages/profile/profile";

import UserSelect from "../../../UserSelect";
import Select from "../../../Select";

import { useCurrentUserPermission, useRoleSelectOptions, useUserChange } from "./hooks";

import {
  actionsWrapperStyles,
  roleModifierWrapperStyles,
  userRowRoleFieldStyles,
  userRowStyles,
  userRowUserFieldStyles,
  wrapperStyles,
} from "./style.css";

export interface EditPermissionInterface {
  isPrivate: boolean;
  allPermissions: PermissionEntity[];
  permission: PermissionEntity;
  onDelete: (entity: PermissionEntity) => Promise<true | ParseServerErrorResult>;
  onSave: (entity: PermissionEntity) => Promise<true | ParseServerErrorResult>;
  onClose: () => void;
}

function EditPermission({ isPrivate, allPermissions, permission, onSave, onDelete, onClose }: EditPermissionInterface) {
  const { t } = useTranslation();
  const entity = React.useMemo(() => permission.clone(), [permission]);
  const { user } = useViewContext().containerInstance.get(ProfileStorage);

  const handleSave = React.useCallback(async () => {
    const result = await onSave(entity);
    if (result === true) {
      onClose();
      return;
    }
    emitRequestError(entity, result, t({ scope: "permissions", place: "errors", name: "update_unexpected_error" }));
  }, [entity, onClose, onSave, t]);

  const handleDelete = React.useCallback(async () => {
    const result = await onDelete(entity);
    if (result === true) {
      onClose();
      return;
    }
    emitRequestError(entity, result, t({ scope: "permissions", place: "errors", name: "delete_unexpected_error" }));
  }, [entity, onClose, onDelete, t]);

  const [{ loading: saving }, asyncHandleSave] = useAsyncFn(handleSave, [handleSave]);
  const [{ loading: deleting }, asyncHandleDelete] = useAsyncFn(handleDelete, [handleDelete]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleSave }),
    [asyncHandleSave, entity],
  );
  const handleDeleteClick = React.useCallback(() => asyncHandleDelete(), [asyncHandleDelete]);

  const currentUserPermission = useCurrentUserPermission(allPermissions, isPrivate)!;
  const rolesSelectOptions = useRoleSelectOptions(currentUserPermission, isPrivate, permission);
  const handleChangeUser = useUserChange(entity);

  return (
    <div className={wrapperStyles}>
      <div className={userRowStyles}>
        <UserSelect
          className={userRowUserFieldStyles}
          disabled
          popupWidth="auto"
          hasNoUser={false}
          required
          value={entity.user?.id}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.user, t)}
          onChange={handleChangeUser}
        />
        <Select
          className={userRowRoleFieldStyles}
          edit
          required
          primaryPlacement="bottom-end"
          value={entity.role}
          options={rolesSelectOptions}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.role, t)}
          onChange={entity.setRole}
        />
      </div>
      <div className={roleModifierWrapperStyles}>
        {canChangeEditorPermissionCheckbox(user.isAdmin, currentUserPermission, entity) && (
          <Checkbox value={!!entity.canEditEditorPermissions} onChange={entity.setCanEditEditorPermissions}>
            {t({ scope: "permissions", place: "role_modifier", name: "can_edit_editor_permission" })}
          </Checkbox>
        )}
        {isPrivate && canChangeReaderPermissionCheckbox(user.isAdmin, currentUserPermission, entity) && (
          <Checkbox value={!!entity.canEditReaderPermissions} onChange={entity.setCanEditReaderPermissions}>
            {t({ scope: "permissions", place: "role_modifier", name: "can_edit_reader_permission" })}
          </Checkbox>
        )}
      </div>
      <div className={actionsWrapperStyles}>
        <Button
          type="WITHOUT_BORDER"
          size="SMALL"
          disabled={saving || deleting}
          iconLeft="closeLine"
          onClick={onClose}
        />
        <Button
          type="WITHOUT_BORDER"
          size="SMALL"
          disabled={saving}
          loading={deleting}
          iconLeft="deleteBinLine"
          onClick={handleDeleteClick}
        />
        <Button
          type="WITHOUT_BORDER"
          size="SMALL"
          disabled={deleting}
          loading={saving}
          iconLeft="checkLine"
          onClick={handleSaveClick}
        />
      </div>
    </div>
  );
}

export default observer(EditPermission);

export { useCurrentUserPermission } from "./hooks";

function canChangeEditorPermissionCheckbox(
  currentUserIsAdmin: boolean,
  currentUserPermission: PermissionEntity,
  permission: PermissionEntity,
) {
  if (permission.role !== PermissionRole.EDITOR) return false;
  if (currentUserIsAdmin) return true;
  if (currentUserPermission.role === PermissionRole.OWNER) return true;
  if (currentUserPermission.role === PermissionRole.EDITOR) {
    if (currentUserPermission.canEditEditorPermissions) return true;
    return false;
  }
  return false;
}

function canChangeReaderPermissionCheckbox(
  currentUserIsAdmin: boolean,
  currentUserPermission: PermissionEntity,
  permission: PermissionEntity,
) {
  if (permission.role !== PermissionRole.READER) return false;
  if (currentUserIsAdmin) return true;
  if (currentUserPermission.role === PermissionRole.OWNER) return true;
  if (currentUserPermission.role === PermissionRole.EDITOR) return true;
  if (currentUserPermission.role === PermissionRole.READER) {
    if (currentUserPermission.canEditReaderPermissions) return true;
    return false;
  }
  return false;
}

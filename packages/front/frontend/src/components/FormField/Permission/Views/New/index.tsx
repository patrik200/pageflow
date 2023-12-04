import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Checkbox } from "@app/ui-kit";
import { PermissionRole } from "@app/shared-enums";
import { getErrorMessageWithCommonIntl, ParseServerErrorResult, useTranslation } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { PermissionEntity } from "core/entities/permission/permision";

import UserSelect from "../../../UserSelect";
import Select from "../../../Select";
import { useCurrentUserPermission, useRoleSelectOptions, useUserChange, useUserFilter } from "../Edit/hooks";

import {
  actionsWrapperStyles,
  userRowRoleFieldStyles,
  userRowStyles,
  userRowUserFieldStyles,
  wrapperStyles,
} from "./style.css";

export interface NewPermissionInterface {
  isPrivate: boolean;
  allPermissions: PermissionEntity[];
  onCreate: (entity: PermissionEntity) => Promise<true | ParseServerErrorResult>;
  onClose: () => void;
}

function NewPermission({ isPrivate, allPermissions, onClose, onCreate }: NewPermissionInterface) {
  const { t } = useTranslation();

  const entity = React.useMemo(() => PermissionEntity.buildEmpty(), []);

  const currentUserPermission = useCurrentUserPermission(allPermissions, isPrivate)!;
  const rolesSelectOptions = useRoleSelectOptions(currentUserPermission, isPrivate);
  const handleChangeUser = useUserChange(entity);
  const filterUsers = useUserFilter(allPermissions);

  const [{ loading }, asyncOnCreate] = useAsyncFn(onCreate, [onCreate]);

  const handleCreate = React.useCallback(async () => {
    const result = await asyncOnCreate(entity);
    if (result === true) {
      onClose();
      return;
    }
    emitRequestError(entity, result, t({ scope: "permissions", place: "errors", name: "create_unexpected_error" }));
  }, [asyncOnCreate, entity, onClose, t]);

  const handleCreateClick = React.useCallback(() => entity.submit({ onSuccess: handleCreate }), [entity, handleCreate]);

  return (
    <div className={wrapperStyles}>
      <div className={userRowStyles}>
        <UserSelect
          className={userRowUserFieldStyles}
          hasNoUser={false}
          popupWidth="auto"
          required
          value={entity.user?.id}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.user, t)}
          filterUsers={filterUsers}
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
      {entity.role === PermissionRole.EDITOR && (
        <Checkbox value={!!entity.canEditEditorPermissions} onChange={entity.setCanEditEditorPermissions}>
          {t({ scope: "permissions", place: "role_modifier", name: "can_edit_editor_permission" })}
        </Checkbox>
      )}
      {entity.role === PermissionRole.READER && isPrivate && (
        <Checkbox value={!!entity.canEditReaderPermissions} onChange={entity.setCanEditReaderPermissions}>
          {t({ scope: "permissions", place: "role_modifier", name: "can_edit_reader_permission" })}
        </Checkbox>
      )}
      <div className={actionsWrapperStyles}>
        <Button type="WITHOUT_BORDER" size="SMALL" disabled={loading} iconLeft="closeLine" onClick={onClose} />
        <Button type="WITHOUT_BORDER" size="SMALL" loading={loading} iconLeft="checkLine" onClick={handleCreateClick} />
      </div>
    </div>
  );
}

export default observer(NewPermission);

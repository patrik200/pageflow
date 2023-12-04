import React from "react";
import { SelectFieldOption } from "@app/ui-kit";
import { PermissionRole } from "@app/shared-enums";
import { TranslationFunction, useTranslation, useViewContext } from "@app/front-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import { UserEntity } from "core/entities/user";
import { PermissionEntity } from "core/entities/permission/permision";

import { ProfileStorage } from "core/storages/profile/profile";
import { AllUsersStorage } from "core/storages/profile/allUsers";

function createUserSelectOption(role: PermissionRole, t: TranslationFunction): SelectFieldOption<PermissionRole> {
  return {
    value: role,
    label: t({ scope: "permissions", place: "role", name: role }),
  };
}

export function useRoleSelectOptions(
  currentUserPermission: PermissionEntity,
  isPrivate: boolean,
  permission?: PermissionEntity,
) {
  const { t } = useTranslation();
  const { user } = useViewContext().containerInstance.get(ProfileStorage);

  return React.useMemo<SelectFieldOption<PermissionRole>[]>(() => {
    if (user.isAdmin) return PermissionEntity.rolesCanCreateAdmin.map((role) => createUserSelectOption(role, t));

    if (permission && permission.user.id === currentUserPermission.user.id)
      return currentUserPermission.rolesCanCreateForYourself.map((role) => createUserSelectOption(role, t));

    return (
      isPrivate ? currentUserPermission.rolesCanCreateForPrivate : currentUserPermission.rolesCanCreateForPublic
    ).map((role) => createUserSelectOption(role, t));
  }, [
    currentUserPermission.rolesCanCreateForPrivate,
    currentUserPermission.rolesCanCreateForPublic,
    currentUserPermission.rolesCanCreateForYourself,
    currentUserPermission.user.id,
    isPrivate,
    permission,
    t,
    user.isAdmin,
  ]);
}

export function useUserChange(entity: PermissionEntity) {
  const { allUsers } = useViewContext().containerInstance.get(AllUsersStorage);

  return React.useCallback(
    (value: string | null) => {
      entity.setUser(value ? allUsers.find((user) => user.id === value) : undefined);
    },
    [allUsers, entity],
  );
}

export function useUserFilter(allPermissions: PermissionEntity[]) {
  return React.useCallback(
    (user: UserEntity) => !allPermissions.some((permission) => permission.user.id === user.id),
    [allPermissions],
  );
}

export function useCurrentUserPermission(allPermissions: PermissionEntity[] | undefined, isPrivate: boolean) {
  const { user } = useViewContext().containerInstance.get(ProfileStorage);
  return useObservableAsDeferredMemo(
    (allPermissions) => {
      if (!allPermissions) return undefined;
      const permission = allPermissions.find((permission) => permission.user.id === user.id);
      if (permission) return permission;
      if (isPrivate) return undefined;
      return PermissionEntity.buildReaderWithoutModifiers(user);
    },
    [isPrivate, user],
    allPermissions,
    { deep: true },
  );
}

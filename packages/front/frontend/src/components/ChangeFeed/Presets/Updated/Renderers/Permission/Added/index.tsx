import React from "react";
import { observer } from "mobx-react-lite";
import { Icon } from "@app/ui-kit";
import { useViewContext } from "@app/front-kit";

import FormFieldPermission from "components/FormField/Permission";
import { FormFieldTextEmptyView } from "components/FormField/Text";

import { PermissionEntity } from "core/entities/permission/permision";

import { AllUsersStorage } from "core/storages/profile/allUsers";

import { PermissionRendererValue } from "../types";

import { iconStyles, wrapperStyles } from "./style.css";

interface PermissionRendererAddedInterface {
  rendererValue: PermissionRendererValue;
}

function PermissionRendererAdded({ rendererValue }: PermissionRendererAddedInterface) {
  const { allUsers } = useViewContext().containerInstance.get(AllUsersStorage);
  const user = React.useMemo(
    () => allUsers.find((user) => user.id === rendererValue.userId),
    [allUsers, rendererValue.userId],
  );

  const permissionFrom = React.useMemo(() => {
    if (!user) return null;
    if (!rendererValue.from) return null;
    return PermissionEntity.buildFromEntityLike({
      role: rendererValue.from.role,
      user,
      canEditReaderPermissions: rendererValue.from.canEditReaderPermissions,
      canEditEditorPermissions: rendererValue.from.canEditEditorPermissions,
    });
  }, [rendererValue.from, user]);

  const permissionTo = React.useMemo(() => {
    if (!user) return null;
    if (!rendererValue.to) return null;
    return PermissionEntity.buildFromEntityLike({
      role: rendererValue.to.role,
      user,
      canEditReaderPermissions: rendererValue.to.canEditReaderPermissions,
      canEditEditorPermissions: rendererValue.to.canEditEditorPermissions,
    });
  }, [rendererValue.to, user]);

  if (!user) return null;

  return (
    <div className={wrapperStyles}>
      {permissionFrom ? (
        <FormFieldPermission isPrivate={false} view permission={permissionFrom} editable={false} />
      ) : (
        <FormFieldTextEmptyView />
      )}
      <Icon className={iconStyles} icon="arrowRightSLine" />
      {permissionTo ? (
        <FormFieldPermission isPrivate={false} view permission={permissionTo} editable={false} />
      ) : (
        <FormFieldTextEmptyView />
      )}
    </div>
  );
}

export default observer(PermissionRendererAdded);

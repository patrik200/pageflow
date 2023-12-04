import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { Button, SelectFieldOption } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { UserRole } from "@app/shared-enums";

import Divider from "components/Divider";
import FormFieldText from "components/FormField/Text";
import FormFieldPhone from "components/FormField/Phone";
import FormFieldEmail from "components/FormField/Email";
import GroupedContent from "components/FormField/GroupedContent";
import FormFieldSelect from "components/FormField/Select";
import FormFieldDate from "components/FormField/Date";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { UserEntity } from "core/entities/user";
import { EditUserEntity } from "core/storages/user/entities/EditUser";

import { UserDetailStorage } from "core/storages/user/userDetail";
import { ProfileStorage } from "core/storages/profile/profile";

import { actionsWrapperStyles } from "./style.css";

interface UserViewModeEditInterface {
  user: UserEntity;
  disableEditMode: () => void;
}

function UserViewModeEdit({ user, disableEditMode }: UserViewModeEditInterface) {
  const { t } = useTranslation("user-profile");
  const { containerInstance } = useViewContext();
  const { updateUser } = containerInstance.get(UserDetailStorage);
  const { user: profile } = containerInstance.get(ProfileStorage);

  const entity = React.useMemo(
    () => EditUserEntity.buildFromUserEntity(user, profile.isAdmin),
    [profile.isAdmin, user],
  );

  const handleSave = React.useCallback(async () => {
    const result = await updateUser(entity);
    if (result.success) {
      emitRequestSuccess(t({ scope: "tab_user", place: "edit", name: "success_message" }));
      disableEditMode?.();
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "tab_user", place: "edit", name: "error_messages", parameter: "unexpected" }),
    );
  }, [disableEditMode, entity, t, updateUser]);

  const [{ loading }, asyncHandleSave] = useAsyncFn(handleSave, [handleSave]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleSave }),
    [asyncHandleSave, entity],
  );

  const roleOptions = React.useMemo<SelectFieldOption<UserRole>[]>(() => {
    const user: SelectFieldOption<UserRole> = {
      value: UserRole.USER,
      label: t({ scope: "common:user_roles", name: "user" }),
    };
    if (profile.isAdmin)
      return [user, { value: UserRole.ADMIN, label: t({ scope: "common:user_roles", name: "admin" }) }];
    return [user];
  }, [profile.isAdmin, t]);

  return (
    <>
      <GroupedContent>
        <FormFieldText
          edit
          required
          title={t({ scope: "tab_user", place: "common_block", name: "name_field", parameter: "placeholder" })}
          value={entity.name}
          errorMessage={entity.viewErrors.name}
          onChange={entity.setName}
        />
        <FormFieldText
          edit
          title={t({ scope: "tab_user", place: "common_block", name: "position_field", parameter: "placeholder" })}
          value={entity.position}
          errorMessage={entity.viewErrors.position}
          onChange={entity.setPosition}
        />
        <FormFieldSelect
          edit
          required
          title={t({ scope: "tab_user", place: "common_block", name: "role_field", parameter: "placeholder" })}
          errorMessage={entity.viewErrors.role}
          options={roleOptions}
          value={entity.role}
          onChange={entity.setRole}
        />
        <FormFieldEmail
          edit
          required
          title={t({ scope: "tab_user", place: "contact_block", name: "email_field", parameter: "placeholder" })}
          value={entity.email}
          errorMessage={entity.viewErrors.email}
          disabled={!profile.isAdmin}
          onChange={entity.setEmail}
        />
        <FormFieldPhone
          edit
          title={t({ scope: "tab_user", place: "contact_block", name: "phone_field", parameter: "placeholder" })}
          value={entity.phone}
          errorMessage={entity.viewErrors.phone}
          onChange={entity.setPhone}
        />
        <FormFieldDate
          edit
          title={t({
            scope: "tab_user",
            place: "common_block",
            name: "unavailable_until_field",
            parameter: "placeholder",
          })}
          value={entity.unavailableUntil}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.unavailableUntil, t)}
          onChange={entity.setUnavailableUntilUntil}
        />
      </GroupedContent>
      <Divider />
      <div className={actionsWrapperStyles}>
        <Button type="OUTLINE" disabled={loading} onClick={disableEditMode}>
          {t({ scope: "tab_user", place: "edit", name: "cancel_edit" })}
        </Button>
        <Button loading={loading} onClick={handleSaveClick}>
          {t({ scope: "tab_user", place: "edit", name: "save_action" })}
        </Button>
      </div>
    </>
  );
}

export default observer(UserViewModeEdit);

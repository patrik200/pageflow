import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { ModalActions, ModalTitle, SelectFieldOption } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { UserRole } from "@app/shared-enums";

import FormFieldText from "components/FormField/Text";
import FormFieldPhone from "components/FormField/Phone";
import FormFieldEmail from "components/FormField/Email";
import GroupedContent from "components/FormField/GroupedContent";
import FormFieldSelect from "components/FormField/Select";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { InvitationEntity } from "core/storages/invites/entities/Invitation";

import { ProfileStorage } from "core/storages/profile/profile";
import { InvitationStorage } from "core/storages/invites";

import { wrapperStyles } from "./style.css";

interface CreateInvitationModalContentInterface {
  close: () => void;
}

function CreateInvitationModalContent({ close }: CreateInvitationModalContentInterface) {
  const { t } = useTranslation("invitation");
  const { containerInstance } = useViewContext();
  const { createInvitation } = containerInstance.get(InvitationStorage);
  const { user: profile } = containerInstance.get(ProfileStorage);
  const entity = React.useMemo(() => InvitationEntity.buildEmpty(profile.isAdmin), [profile.isAdmin]);

  const roleOptions = React.useMemo<SelectFieldOption<UserRole>[]>(() => {
    const user: SelectFieldOption<UserRole> = {
      value: UserRole.USER,
      label: t({ scope: "common:user_roles", name: "user" }),
    };
    if (profile.isAdmin)
      return [user, { value: UserRole.ADMIN, label: t({ scope: "common:user_roles", name: "admin" }) }];
    return [user];
  }, [profile.isAdmin, t]);

  const handleSave = React.useCallback(async () => {
    const result = await createInvitation(entity);
    if (result.success) {
      emitRequestSuccess(t({ scope: "messages", name: "success" }));
      close();
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "tab_user", place: "create", name: "error_messages", parameter: "unexpected" }),
    );
  }, [close, createInvitation, entity, t]);

  const [{ loading }, asyncHandleSave] = useAsyncFn(handleSave, [handleSave]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleSave }),
    [asyncHandleSave, entity],
  );

  return (
    <>
      <ModalTitle>{t({ scope: "meta", name: "title" })}</ModalTitle>
      <div className={wrapperStyles}>
        <GroupedContent>
          <FormFieldText
            edit
            required
            placeholder={t({
              scope: "create_invitation_modal",
              place: "common_block",
              name: "name_field",
              parameter: "placeholder",
            })}
            value={entity.name}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.name, t)}
            onChange={entity.setName}
          />
          <FormFieldText
            edit
            placeholder={t({
              scope: "create_invitation_modal",
              place: "common_block",
              name: "position_field",
              parameter: "placeholder",
            })}
            value={entity.position}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.position, t)}
            onChange={entity.setPosition}
          />
          <FormFieldSelect
            edit
            required
            placeholder={t({
              scope: "create_invitation_modal",
              place: "common_block",
              name: "role_field",
              parameter: "placeholder",
            })}
            options={roleOptions}
            value={entity.role}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.role, t)}
            onChange={entity.setRole}
          />
          <FormFieldEmail
            edit
            required
            placeholder={t({
              scope: "create_invitation_modal",
              place: "contact_block",
              name: "email_field",
              parameter: "placeholder",
            })}
            value={entity.email}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.email, t)}
            onChange={entity.setEmail}
          />
          <FormFieldPhone
            edit
            placeholder={t({
              scope: "create_invitation_modal",
              place: "contact_block",
              name: "phone_field",
              parameter: "placeholder",
            })}
            value={entity.phone}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.phone, t)}
            onChange={entity.setPhone}
          />
        </GroupedContent>
      </div>
      <ModalActions
        primaryActionText={t({ scope: "actions", place: "send", name: "title" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleSaveClick}
      />
    </>
  );
}

export default observer(CreateInvitationModalContent);

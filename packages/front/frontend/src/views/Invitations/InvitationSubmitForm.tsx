import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { UserRole } from "@app/shared-enums";
import { Button, SelectFieldOption } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { observer } from "mobx-react-lite";
import React from "react";

import FormFieldEmail from "components/FormField/Email";
import FormFieldPassword from "components/FormField/Password";
import FormFieldPhone from "components/FormField/Phone";
import FormFieldSelect from "components/FormField/Select";
import FormFieldText from "components/FormField/Text";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { InvitationPayloadEntity } from "core/entities/invitation";
import { EditUserEntity } from "core/storages/user/entities/EditUser";

import { InvitationStorage } from "core/storages/invites";

import { submitInvitationButton } from "./styles.css";

interface InvitationSubmitFormProps {
  invitation: InvitationPayloadEntity;
  invitationToken: string;
}

function InvitationSubmitForm({ invitation, invitationToken }: InvitationSubmitFormProps) {
  const { push } = useRouter();
  const { t } = useTranslation("invitation");

  const { containerInstance } = useViewContext();
  const { createUserByInvitation } = containerInstance.get(InvitationStorage);

  const userEntity = React.useMemo(() => EditUserEntity.buildEmpty(false), []);

  const roleOptions = React.useMemo<SelectFieldOption<UserRole>[]>(() => {
    if (invitation.role === UserRole.ADMIN) {
      const admin = { value: UserRole.ADMIN, label: t({ scope: "common:user_roles", name: "admin" }) };
      return [admin];
    }
    const user = { value: UserRole.USER, label: t({ scope: "common:user_roles", name: "user" }) };
    return [user];
  }, [t, invitation]);

  const handleSubmit = React.useCallback(async () => {
    const result = await createUserByInvitation(userEntity, invitationToken);
    if (result.success) {
      emitRequestSuccess(t({ scope: "messages", place: "submit", name: "success" }));
      setTimeout(() => void push.current("/auth/login"), 2000);
      return;
    }
    emitRequestError(userEntity, result.error, t({ scope: "messages", place: "submit", name: "unexpected_error" }));
  }, [createUserByInvitation, userEntity, invitationToken, push, t]);

  const [{ loading }, asyncHandleSubmit] = useAsyncFn(handleSubmit, [handleSubmit]);

  const handleSubmitClick = React.useCallback(
    () => userEntity.submit({ onSuccess: asyncHandleSubmit }),
    [asyncHandleSubmit, userEntity],
  );

  React.useEffect(() => {
    userEntity.restoreFromInvitation(invitation);
  }, [userEntity, invitation]);

  return (
    <>
      <FormFieldText
        edit
        required
        title={t({
          scope: "create_invitation_modal",
          place: "common_block",
          name: "name_field",
          parameter: "placeholder",
        })}
        value={userEntity.name}
        errorMessage={userEntity.viewErrors.name}
        onChange={userEntity.setName}
      />
      <FormFieldText
        edit
        title={t({
          scope: "create_invitation_modal",
          place: "common_block",
          name: "position_field",
          parameter: "placeholder",
        })}
        value={userEntity.position}
        onChange={null!}
        disabled
      />
      <FormFieldSelect
        edit
        required
        title={t({
          scope: "create_invitation_modal",
          place: "common_block",
          name: "role_field",
          parameter: "placeholder",
        })}
        options={roleOptions}
        value={userEntity.role}
        onChange={null!}
        disabled
      />
      <FormFieldEmail
        edit
        required
        title={t({
          scope: "create_invitation_modal",
          place: "contact_block",
          name: "email_field",
          parameter: "placeholder",
        })}
        disabled
        value={userEntity.email}
        onChange={null!}
      />
      <FormFieldPhone
        edit
        title={t({
          scope: "create_invitation_modal",
          place: "contact_block",
          name: "phone_field",
          parameter: "placeholder",
        })}
        value={userEntity.phone}
        errorMessage={userEntity.viewErrors.phone}
        onChange={userEntity.setPhone}
      />
      <FormFieldPassword
        edit
        required
        title={t({
          scope: "create_invitation_modal",
          place: "common_block",
          name: "password_field",
          parameter: "placeholder",
        })}
        value={userEntity.password}
        errorMessage={userEntity.viewErrors.password}
        onChange={userEntity.setPassword}
      />
      <FormFieldPassword
        edit
        required
        title={t({
          scope: "create_invitation_modal",
          place: "common_block",
          name: "repeat_password_field",
          parameter: "placeholder",
        })}
        value={userEntity.repeatPassword}
        errorMessage={userEntity.viewErrors.repeatPassword}
        onChange={userEntity.setRepeatPassword}
      />
      <Button loading={loading} onClick={handleSubmitClick} className={submitInvitationButton}>
        {t({ scope: "actions", place: "create", name: "title" })}
      </Button>
    </>
  );
}

export default observer(InvitationSubmitForm);

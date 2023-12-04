import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { ModalActions, ModalTitle, PasswordField } from "@app/ui-kit";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { EditUserPasswordEntity } from "core/storages/user/entities/EditUser";

import { UserDetailStorage } from "core/storages/user/userDetail";

import { wrapperStyles } from "./style.css";

interface ChangePasswordModalContentInterface {
  close: () => void;
}

function ChangePasswordModalContent({ close }: ChangePasswordModalContentInterface) {
  const { t } = useTranslation("user-profile");
  const { user, updateUserPassword } = useViewContext().containerInstance.get(UserDetailStorage);
  const entity = React.useMemo(() => EditUserPasswordEntity.buildEmpty(user!), [user]);
  const handleUpdateUser = React.useCallback(async () => {
    const result = await updateUserPassword(entity);
    if (result.success) {
      emitRequestSuccess(t({ scope: "tab_user", place: "change_password_modal", name: "success_message" }));
      close();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "tab_user", place: "change_password_modal", name: "error_messages", parameter: "unexpected" }),
    );
  }, [close, entity, t, updateUserPassword]);

  const [{ loading }, asyncHandleUpdateUser] = useAsyncFn(handleUpdateUser, [handleUpdateUser]);

  const handleClickUpdate = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleUpdateUser }),
    [asyncHandleUpdateUser, entity],
  );

  return (
    <>
      <ModalTitle>{t({ scope: "tab_user", place: "change_password_modal", name: "title" })}</ModalTitle>
      <div className={wrapperStyles}>
        <PasswordField
          value={entity.password}
          required
          placeholder={t({
            scope: "tab_user",
            place: "change_password_modal",
            name: "password_field",
            parameter: "placeholder",
          })}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.password, t)}
          onChangeInput={entity.setPassword}
        />
        <PasswordField
          value={entity.repeatPassword}
          required
          placeholder={t({
            scope: "tab_user",
            place: "change_password_modal",
            name: "repeat_password_field",
            parameter: "placeholder",
          })}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.repeatPassword, t)}
          onChangeInput={entity.setRepeatPassword}
        />
      </div>
      <ModalActions
        primaryActionText={t({ scope: "tab_user", place: "change_password_modal", name: "change_action" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleClickUpdate}
      />
    </>
  );
}

export default observer(ChangePasswordModalContent);

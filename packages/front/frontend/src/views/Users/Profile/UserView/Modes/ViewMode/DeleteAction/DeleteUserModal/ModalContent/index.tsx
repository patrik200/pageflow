import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle, Typography } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { UserDetailStorage } from "core/storages/user/userDetail";

import { descriptionStyles, wrapperStyles } from "./style.css";

interface DeleteUserModalContentInterface {
  close: () => void;
}

function DeleteUserModalContent({ close }: DeleteUserModalContentInterface) {
  const { t } = useTranslation("user-profile");
  const { user, deleteUser, loadUser } = useViewContext().containerInstance.get(UserDetailStorage);
  const handleDeleteUser = React.useCallback(async () => {
    const result = await deleteUser(user!.id);
    if (result.success) {
      emitRequestSuccess(t({ scope: "tab_user", place: "delete_modal", name: "success_message" }));
      await loadUser(user!.id);
      close();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "tab_user", place: "delete_modal", name: "error_messages", parameter: "unexpected" }),
    );
  }, [close, deleteUser, loadUser, t, user]);

  const [{ loading }, asyncHandleDeleteUser] = useAsyncFn(handleDeleteUser, [handleDeleteUser]);

  const handleClickDelete = React.useCallback(() => asyncHandleDeleteUser(), [asyncHandleDeleteUser]);

  return (
    <>
      <ModalTitle>{t({ scope: "tab_user", place: "delete_modal", name: "title" })}</ModalTitle>
      <div className={wrapperStyles}>
        <Typography className={descriptionStyles}>
          {t({ scope: "tab_user", place: "delete_modal", name: "description" })}
        </Typography>
      </div>
      <ModalActions
        primaryActionText={t({ scope: "tab_user", place: "delete_modal", name: "delete_action" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleClickDelete}
      />
    </>
  );
}

export default observer(DeleteUserModalContent);

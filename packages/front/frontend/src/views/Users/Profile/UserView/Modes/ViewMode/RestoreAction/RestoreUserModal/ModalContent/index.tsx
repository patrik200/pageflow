import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { UserDetailStorage } from "core/storages/user/userDetail";

import { actionsStyles } from "./style.css";

interface RestoreUserModalContentInterface {
  close: () => void;
}

function RestoreUserModalContent({ close }: RestoreUserModalContentInterface) {
  const { t } = useTranslation("user-profile");
  const { user, restoreUser, loadUser } = useViewContext().containerInstance.get(UserDetailStorage);
  const handleRestoreUser = React.useCallback(async () => {
    const result = await restoreUser(user!.id);
    if (result.success) {
      emitRequestSuccess(t({ scope: "tab_user", place: "restore_modal", name: "success_message" }));
      await loadUser(user!.id);
      close();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "tab_user", place: "restore_modal", name: "error_messages", parameter: "unexpected" }),
    );
  }, [close, loadUser, restoreUser, t, user]);

  const [{ loading }, asyncHandleRestoreUser] = useAsyncFn(handleRestoreUser, [handleRestoreUser]);

  const handleRestoreDelete = React.useCallback(() => asyncHandleRestoreUser(), [asyncHandleRestoreUser]);

  return (
    <>
      <ModalTitle>{t({ scope: "tab_user", place: "restore_modal", name: "title" })}</ModalTitle>
      <ModalActions
        className={actionsStyles}
        primaryActionText={t({ scope: "tab_user", place: "restore_modal", name: "restore_action" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleRestoreDelete}
      />
    </>
  );
}

export default observer(RestoreUserModalContent);

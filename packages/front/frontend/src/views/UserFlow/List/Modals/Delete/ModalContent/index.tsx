import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { UserFlowEntity } from "core/entities/userFlow/userFlow";

import { UserFlowStorage } from "core/storages/user-flow";

import { actionsStyles, wrapperStyles } from "./style.css";

interface DeleteUserFlowModalContentInterface {
  userFlow: UserFlowEntity;
  close: () => void;
}

function DeleteUserFlowModalContent({ userFlow, close }: DeleteUserFlowModalContentInterface) {
  const { t } = useTranslation("user-flow");
  const { delete: deleteUserFlow } = useViewContext().containerInstance.get(UserFlowStorage);

  const handleDelete = React.useCallback(async () => {
    const result = await deleteUserFlow(userFlow.id);
    if (result.success) {
      close();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "delete_user_flow_modal", place: "error_messages", name: "unexpected" }),
    );
  }, [close, deleteUserFlow, t, userFlow.id]);

  const [{ loading }, asyncHandleDelete] = useAsyncFn(handleDelete, [handleDelete]);

  return (
    <div className={wrapperStyles}>
      <ModalTitle>{t({ scope: "delete_user_flow_modal", name: "title" }, { name: userFlow.name })}</ModalTitle>
      <ModalActions
        className={actionsStyles}
        primaryActionText={t({ scope: "delete_user_flow_modal", place: "actions", name: "delete" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={asyncHandleDelete}
      />
    </div>
  );
}

export default observer(DeleteUserFlowModalContent);

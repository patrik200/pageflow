import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { UserFlowEntity } from "core/entities/userFlow/userFlow";
import { EditUserFlowEntity } from "core/storages/user-flow/entities/EditUserFlow";

import { UserFlowStorage } from "core/storages/user-flow";

import UserFlowFields from "./Fields";

import { wrapperStyles } from "./style.css";

interface EditUserFlowModalContentInterface {
  userFlow?: UserFlowEntity;
  close: () => void;
}

function EditUserFlowModalContent({ userFlow, close }: EditUserFlowModalContentInterface) {
  const { t } = useTranslation("user-flow");
  const { create, update } = useViewContext().containerInstance.get(UserFlowStorage);

  const entity = React.useMemo(
    () => (userFlow ? EditUserFlowEntity.buildFromUserFlow(userFlow) : EditUserFlowEntity.buildEmpty()),
    [userFlow],
  );

  const handleSave = React.useCallback(async () => {
    const result = userFlow ? await update(entity) : await create(entity);
    if (result.success) {
      close();
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "edit_user_flow_modal", place: "error_messages", name: "unexpected" }),
    );
  }, [close, create, entity, t, update, userFlow]);

  const [{ loading }, asyncHandleSave] = useAsyncFn(handleSave, [handleSave]);

  const handleSaveClick = React.useCallback(() => entity.fullSubmit(asyncHandleSave), [asyncHandleSave, entity]);

  return (
    <div className={wrapperStyles}>
      <ModalTitle>
        {userFlow
          ? t({ scope: "edit_user_flow_modal", place: "title", name: "edit" }, { name: userFlow.name })
          : t({ scope: "edit_user_flow_modal", place: "title", name: "create" })}
      </ModalTitle>
      <UserFlowFields entity={entity} />
      <ModalActions
        primaryActionText={t({ scope: "edit_user_flow_modal", place: "actions", name: "save" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleSaveClick}
      />
    </div>
  );
}

export default observer(EditUserFlowModalContent);

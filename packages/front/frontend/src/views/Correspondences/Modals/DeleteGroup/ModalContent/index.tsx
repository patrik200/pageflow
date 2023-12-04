import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

import { CorrespondenceStorage } from "core/storages/correspondence";

import { actionsStyles } from "./style.css";

interface DeleteGroupModalContentInterface {
  group: CorrespondenceGroupEntity;
  close: () => void;
  onSuccess?: () => void;
}

function DeleteGroupModalContent({ group, close, onSuccess }: DeleteGroupModalContentInterface) {
  const { t } = useTranslation("correspondence");
  const { deleteGroup } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const handleDeleteGroup = React.useCallback(async () => {
    const result = await deleteGroup(group.id);
    if (result.success) {
      close();
      onSuccess?.();
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "delete_group_modal", name: "error_messages", parameter: "unexpected" }),
    );
  }, [close, deleteGroup, group.id, onSuccess, t]);

  const [{ loading }, asyncHandleDeleteGroup] = useAsyncFn(handleDeleteGroup, [handleDeleteGroup]);

  return (
    <>
      <ModalTitle>{t({ scope: "delete_group_modal", name: "title" }, { name: group.name })}</ModalTitle>
      <ModalActions
        className={actionsStyles}
        primaryActionLoading={loading}
        primaryActionText={t({ scope: "delete_group_modal", name: "actions", parameter: "delete" })}
        onPrimaryActionClick={asyncHandleDeleteGroup}
      />
    </>
  );
}

export default observer(DeleteGroupModalContent);

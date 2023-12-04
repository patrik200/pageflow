import React from "react";
import { observer } from "mobx-react-lite";
import { Checkbox, ModalActions, ModalTitle, TextField } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

import { CorrespondenceStorage } from "core/storages/correspondence";

import { wrapperStyles } from "./style.css";

interface EditGroupModalContentInterface {
  group?: CorrespondenceGroupEntity;
  close: () => void;
  onSuccess?: () => void;
}

function EditGroupModalContent({ group, close, onSuccess }: EditGroupModalContentInterface) {
  const { t } = useTranslation("correspondence");
  const { createGroup, updateGroup, filter } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const entity = React.useMemo(
    () => (group ? filter.getEditCorrespondenceGroupEntity(group) : filter.getCreateCorrespondenceGroupEntity()),
    [filter, group],
  );

  const handleSaveGroup = React.useCallback(async () => {
    const result = entity.isEdit ? await updateGroup(entity) : await createGroup(entity);

    if (result.success) {
      close();
      onSuccess?.();
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({
        scope: "edit_group_modal",
        place: "error_messages",
        name: entity.isEdit ? "unexpected_edit" : "unexpected_create",
      }),
    );
  }, [close, createGroup, entity, onSuccess, t, updateGroup]);

  const [{ loading }, asyncHandleUpdateGroup] = useAsyncFn(handleSaveGroup, [handleSaveGroup]);

  const handleSaveClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleUpdateGroup }),
    [asyncHandleUpdateGroup, entity],
  );

  return (
    <>
      <ModalTitle>
        {t(
          { scope: "edit_group_modal", name: "title", parameter: entity.isEdit ? "edit" : "create" },
          { name: group?.name },
        )}
      </ModalTitle>
      <div className={wrapperStyles}>
        <TextField
          placeholder={t({ scope: "edit_group_modal", name: "name_filed", parameter: "placeholder" })}
          required
          disabled={loading}
          value={entity.name}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.name, t)}
          onChangeInput={entity.setName}
        />
        <TextField
          placeholder={t({ scope: "edit_group_modal", name: "description_filed", parameter: "placeholder" })}
          textArea
          disabled={loading}
          rows={5}
          value={entity.description}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.description, t)}
          onChangeInput={entity.setDescription}
        />
        <Checkbox disabled={loading} value={entity.isPrivate} onChange={entity.setIsPrivate}>
          {t({ scope: "edit_group_modal", name: "privacy_field", parameter: "placeholder" })}
        </Checkbox>
      </div>
      <ModalActions
        primaryActionText={t({
          scope: "edit_group_modal",
          name: "actions",
          parameter: entity.isEdit ? "save" : "create",
        })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleSaveClick}
      />
    </>
  );
}

export default observer(EditGroupModalContent);
